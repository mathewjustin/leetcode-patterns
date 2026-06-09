import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/lib/analytics", () => ({
  trackEvent: vi.fn(),
}));

import TipsView from "./TipsView";

describe("TipsView", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows the two starter traversal tips", () => {
    render(<TipsView />);

    expect(
      screen.getByText("Toggle traversal direction with one boolean"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Move the boundary past elements already searched"),
    ).toBeInTheDocument();
  });

  it("adds and persists a personal tip", async () => {
    const user = userEvent.setup();
    render(<TipsView />);

    await user.click(screen.getByRole("button", { name: "Add tip" }));
    await user.type(screen.getByLabelText("Title"), "Keep a loop invariant");
    await user.clear(screen.getByLabelText("Category"));
    await user.type(screen.getByLabelText("Category"), "Loops");
    await user.type(
      screen.getByLabelText("Explanation"),
      "Write down what remains true before and after every iteration.",
    );
    await user.click(screen.getByRole("button", { name: "Save tip" }));

    expect(screen.getByText("Keep a loop invariant")).toBeInTheDocument();
    expect(
      JSON.parse(localStorage.getItem("leetcode-patterns-personal-tips") ?? "[]"),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Keep a loop invariant",
          category: "Loops",
        }),
      ]),
    );
  });

  it("edits an existing tip", async () => {
    const user = userEvent.setup();
    render(<TipsView />);

    await user.click(
      screen.getByRole("button", {
        name: "Edit Toggle traversal direction with one boolean",
      }),
    );
    const title = screen.getByLabelText("Title");
    await user.clear(title);
    await user.type(title, "Alternate direction with a boolean");
    await user.click(screen.getByRole("button", { name: "Save tip" }));

    expect(
      screen.getByText("Alternate direction with a boolean"),
    ).toBeInTheDocument();
  });

  it("deletes a tip after confirmation", async () => {
    const user = userEvent.setup();
    render(<TipsView />);

    await user.click(
      screen.getByRole("button", {
        name: "Delete Toggle traversal direction with one boolean",
      }),
    );
    await user.click(screen.getByRole("button", { name: "Delete tip" }));

    expect(
      screen.queryByText("Toggle traversal direction with one boolean"),
    ).not.toBeInTheDocument();
  });
});
