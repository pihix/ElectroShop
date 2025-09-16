import { render, screen } from "@testing-library/react";
import Banner from "../Banner";

describe("Banner component", () => {
  it("renders subtitle, title and offer text correctly", () => {
    render(<Banner />);

    expect(
      screen.getByText(/Les meilleures offres en ligne/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/PORTABLE & MONTRE INTELLIGENT./i)
    ).toBeInTheDocument();
    expect(screen.getByText(/JUSQU'À 80% DE RÉDUCTION/i)).toBeInTheDocument();
  });

  it("renders the smart watch image", () => {
    render(<Banner />);
    const image = screen.getByAltText(/Smart Watch/i);
    expect(image).toBeInTheDocument();
  });
});
