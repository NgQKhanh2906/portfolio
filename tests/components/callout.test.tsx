import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Callout } from "@/components/mdx/callout";

describe("Callout Component", () => {
  it("renders with default info type and children", () => {
    render(<Callout>This is an important note.</Callout>);
    expect(screen.getByText("This is an important note.")).toBeInTheDocument();
  });

  it("renders title and warning variant", () => {
    render(
      <Callout type="warning" title="Cảnh báo">
        Hãy kiểm tra kỹ cấu hình trước khi chạy.
      </Callout>,
    );
    expect(screen.getByText("Cảnh báo")).toBeInTheDocument();
    expect(
      screen.getByText("Hãy kiểm tra kỹ cấu hình trước khi chạy."),
    ).toBeInTheDocument();
  });
});
