import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import FindDisappearedNumbersAnimation from "./FindDisappearedNumbersAnimation";
import MajorityElementAnimation from "./MajorityElementAnimation";
import MissingNumberAnimation from "./MissingNumberAnimation";
import ProductExceptSelfAnimation from "./ProductExceptSelfAnimation";

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

    expect(screen.getByText("Missing Number: The XOR Bucket")).toBeInTheDocument();
    expect(screen.getByText("Shuffled drop order")).toBeInTheDocument();
    expect(screen.getByText("XOR bucket")).toBeInTheDocument();
    expect(screen.getByText("x ^ x = 0")).toBeInTheDocument();

    await advanceToEnd();

    expect(screen.getByText("The value left in the bucket is 2")).toBeInTheDocument();
    expect(screen.getByText("Why one loop creates the same bucket")).toBeInTheDocument();
    expect(screen.getByText(/missing \^= nums\[i\]/)).toBeInTheDocument();
  });

  it("shows Boyer-Moore vote changes and the final candidate", async () => {
    render(<MajorityElementAnimation />);

    expect(screen.getByText("Boyer-Moore Voting Walkthrough")).toBeInTheDocument();
    expect(screen.getByText(/Choose 2, then add one vote/)).toBeInTheDocument();

    await advanceToEnd();

    expect(screen.getByText("Return candidate 2")).toBeInTheDocument();
  });

  it("builds product except self with prefix and suffix passes", async () => {
    render(<ProductExceptSelfAnimation />);

    expect(
      screen.getByText("Product Except Self: Meet in the Middle"),
    ).toBeInTheDocument();
    expect(screen.getByText("1. Collect left products")).toBeInTheDocument();
    expect(screen.getByText("exclude self")).toBeInTheDocument();
    expect(screen.getByText(/Write first, multiply second/)).toBeInTheDocument();

    await advanceToEnd();

    expect(screen.getByText("Left and right snap together")).toBeInTheDocument();
    expect(screen.getByText("[-60, 120, -40, -30, -24]")).toBeInTheDocument();
  });
});
