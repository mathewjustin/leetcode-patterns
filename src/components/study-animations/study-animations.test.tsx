import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import FindDisappearedNumbersAnimation from "./FindDisappearedNumbersAnimation";
import MajorityElementAnimation from "./MajorityElementAnimation";
import MissingNumberAnimation from "./MissingNumberAnimation";

async function advanceToEnd() {
  const user = userEvent.setup();
  const next = screen.getByRole("button", { name: "Next step" });

  while (!next.hasAttribute("disabled")) {
    await user.click(next);
  }
}

describe("dedicated study animations", () => {
  it("shows in-place marking and the disappeared values", async () => {
    render(<FindDisappearedNumbersAnimation />);

    expect(screen.getByText("In-Place Marking Walkthrough")).toBeInTheDocument();
    expect(screen.getByText(/maps to index 3/)).toBeInTheDocument();

    await advanceToEnd();

    expect(screen.getByText("Return [5, 6]")).toBeInTheDocument();
  });

  it("shows XOR cancellation and the missing number", async () => {
    render(<MissingNumberAnimation />);

    expect(screen.getByText("XOR Cancellation Walkthrough")).toBeInTheDocument();
    expect(screen.getByText("missing = n = 3")).toBeInTheDocument();

    await advanceToEnd();

    expect(screen.getByText("Return 2")).toBeInTheDocument();
  });

  it("shows Boyer-Moore vote changes and the final candidate", async () => {
    render(<MajorityElementAnimation />);

    expect(screen.getByText("Boyer-Moore Voting Walkthrough")).toBeInTheDocument();
    expect(screen.getByText(/Choose 2, then add one vote/)).toBeInTheDocument();

    await advanceToEnd();

    expect(screen.getByText("Return candidate 2")).toBeInTheDocument();
  });
});
