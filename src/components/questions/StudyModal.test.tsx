import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Question } from "@/types/question";
import StudyModal from "./StudyModal";

const addTwoNumbers: Question = {
  id: 1,
  title: "Add Two Numbers",
  slug: "add-two-numbers",
  pattern: ["Linked List"],
  difficulty: "Medium",
  premium: false,
  companies: [],
};

describe("StudyModal", () => {
  it("uses linked-list specific labels for Add Two Numbers", async () => {
    const user = userEvent.setup();

    render(<StudyModal question={addTwoNumbers} onClose={vi.fn()} />);

    expect(screen.getByText("Naive Conversion")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Show conversion approach" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Digit-by-Digit Solution")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Show conversion approach" }));

    expect(screen.getByText("Why Conversion Breaks")).toBeInTheDocument();
    expect(
      screen.getByText(/can overflow normal integer types/),
    ).toBeInTheDocument();
  });
});
