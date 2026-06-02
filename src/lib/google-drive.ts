import {
  CLOUD_DOCUMENT_NAME,
  createCloudDocument,
  normalizeCloudDocument,
  type CloudDocument,
} from "./cloud-document";

const DRIVE_API = "https://www.googleapis.com/drive/v3";
const DRIVE_UPLOAD_API = "https://www.googleapis.com/upload/drive/v3";
const JSON_MIME = "application/json";

interface DriveFile {
  id: string;
  name: string;
  modifiedTime?: string;
}

export class GoogleDriveAppDataStore {
  constructor(private accessToken: string) {}

  async read(): Promise<{ fileId: string | null; document: CloudDocument | null }> {
    const file = await this.findFile();
    if (!file) return { fileId: null, document: null };

    const res = await fetch(`${DRIVE_API}/files/${file.id}?alt=media`, {
      headers: this.headers(),
    });
    if (!res.ok) throw new Error(`Google Drive read failed (${res.status})`);

    const raw = await res.json();
    return { fileId: file.id, document: normalizeCloudDocument(raw) };
  }

  async write(document: CloudDocument, fileId?: string | null): Promise<string> {
    const existingFileId = fileId ?? (await this.findFile())?.id ?? null;
    if (existingFileId) {
      await this.updateFile(existingFileId, document);
      return existingFileId;
    }
    return this.createFile(document);
  }

  private async findFile(): Promise<DriveFile | null> {
    const params = new URLSearchParams({
      spaces: "appDataFolder",
      fields: "files(id,name,modifiedTime)",
      q: `name='${CLOUD_DOCUMENT_NAME.replaceAll("'", "\\'")}' and trashed=false`,
    });

    const res = await fetch(`${DRIVE_API}/files?${params}`, {
      headers: this.headers(),
    });
    if (!res.ok) throw new Error(`Google Drive file lookup failed (${res.status})`);

    const data = (await res.json()) as { files?: DriveFile[] };
    return data.files?.[0] ?? null;
  }

  private async createFile(document: CloudDocument): Promise<string> {
    const metadata = {
      name: CLOUD_DOCUMENT_NAME,
      parents: ["appDataFolder"],
      mimeType: JSON_MIME,
    };
    const res = await fetch(`${DRIVE_UPLOAD_API}/files?uploadType=multipart&fields=id`, {
      method: "POST",
      headers: this.multipartHeaders(),
      body: this.multipartBody(metadata, document),
    });
    if (!res.ok) throw new Error(`Google Drive create failed (${res.status})`);
    const data = (await res.json()) as { id: string };
    return data.id;
  }

  private async updateFile(fileId: string, document: CloudDocument): Promise<void> {
    const metadata = {
      name: CLOUD_DOCUMENT_NAME,
      mimeType: JSON_MIME,
    };
    const res = await fetch(`${DRIVE_UPLOAD_API}/files/${fileId}?uploadType=multipart`, {
      method: "PATCH",
      headers: this.multipartHeaders(),
      body: this.multipartBody(metadata, document),
    });
    if (!res.ok) throw new Error(`Google Drive update failed (${res.status})`);
  }

  private headers(): HeadersInit {
    return {
      Authorization: `Bearer ${this.accessToken}`,
    };
  }

  private multipartHeaders(): HeadersInit {
    return {
      ...this.headers(),
      "Content-Type": "multipart/related; boundary=leetcode-patterns-boundary",
    };
  }

  private multipartBody(metadata: unknown, document: CloudDocument): string {
    const boundary = "leetcode-patterns-boundary";
    return [
      `--${boundary}`,
      "Content-Type: application/json; charset=UTF-8",
      "",
      JSON.stringify(metadata),
      `--${boundary}`,
      "Content-Type: application/json; charset=UTF-8",
      "",
      JSON.stringify(document ?? createCloudDocument()),
      `--${boundary}--`,
      "",
    ].join("\r\n");
  }
}
