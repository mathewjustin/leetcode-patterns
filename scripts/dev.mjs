import { spawn, spawnSync } from "node:child_process";

const compose = spawnSync(
  "docker",
  ["compose", "up", "-d", "--pull", "missing", "excalidraw"],
  { stdio: "inherit" },
);

if (compose.error) {
  console.error(`Unable to start Excalidraw: ${compose.error.message}`);
  process.exit(1);
}

if (compose.status !== 0) {
  process.exit(compose.status ?? 1);
}

console.log("Excalidraw is available at http://localhost:8080");

const next = spawn("next", ["dev"], {
  stdio: "inherit",
  shell: process.platform === "win32",
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => next.kill(signal));
}

next.on("error", (error) => {
  console.error(`Unable to start Next.js: ${error.message}`);
  process.exit(1);
});

next.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
