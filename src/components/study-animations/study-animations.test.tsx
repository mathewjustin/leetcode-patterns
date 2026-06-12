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

    expect(screen.getByText("Missing Number: Why XOR Works")).toBeInTheDocument();
    expect(screen.getByText("What is bitwise XOR (^), exactly?")).toBeInTheDocument();
    expect(screen.getByText("Other Ways To Solve It")).toBeInTheDocument();
    expect(screen.getByText("Sum formula")).toBeInTheDocument();
    expect(screen.getByText("The same lists in binary")).toBeInTheDocument();

    await advanceToEnd();

    expect(screen.getByText("The unpaired value is 2")).toBeInTheDocument();
    expect(screen.getByText("Where does the expected range come from?")).toBeInTheDocument();
    expect(screen.getByText("Binary accumulator trace")).toBeInTheDocument();
    expect(screen.getByText("01 ^ 10 ^ 01")).toBeInTheDocument();
  });

  it("shows Boyer-Moore vote changes and the final candidate", async () => {
    render(<MajorityElementAnimation />);

    expect(screen.getByText("Boyer-Moore Voting Walkthrough")).toBeInTheDocument();
    expect(screen.getByText(/Choose 2, then add one vote/)).toBeInTheDocument();

    await advanceToEnd();

    expect(screen.getByText("Return candidate 2")).toBeInTheDocument();
  });
});
