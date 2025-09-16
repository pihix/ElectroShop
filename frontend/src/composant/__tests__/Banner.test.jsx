import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import Banner from "../Banner.jsx";

describe("Banner component", () => {
  it("renders correct main title", () => {
    render(<Banner />);
    expect(
      screen.getByText("PORTABLE & MONTRE INTELLIGENT.")
    ).toBeInTheDocument();
  });
});
