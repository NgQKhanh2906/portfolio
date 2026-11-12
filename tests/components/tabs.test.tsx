import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

describe("Tabs Component (WAI-ARIA Pattern)", () => {
  function renderTabs() {
    return render(
      <Tabs defaultValue="tab-1">
        <TabsList aria-label="Kiểm thử Tabs">
          <TabsTrigger value="tab-1">Thẻ 1</TabsTrigger>
          <TabsTrigger value="tab-2">Thẻ 2</TabsTrigger>
          <TabsTrigger value="tab-3">Thẻ 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab-1">Nội dung thẻ 1</TabsContent>
        <TabsContent value="tab-2">Nội dung thẻ 2</TabsContent>
        <TabsContent value="tab-3">Nội dung thẻ 3</TabsContent>
      </Tabs>,
    );
  }

  it("renders tablist and triggers with correct ARIA attributes", () => {
    renderTabs();

    const tablist = screen.getByRole("tablist", { name: "Kiểm thử Tabs" });
    expect(tablist).toBeInTheDocument();

    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(3);

    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveAttribute("tabindex", "0");
    expect(tabs[1]).toHaveAttribute("aria-selected", "false");
    expect(tabs[1]).toHaveAttribute("tabindex", "-1");

    expect(screen.getByText("Nội dung thẻ 1")).toBeInTheDocument();
    expect(screen.queryByText("Nội dung thẻ 2")).not.toBeInTheDocument();
  });

  it("switches active tab and content on click", () => {
    renderTabs();

    const tabs = screen.getAllByRole("tab");
    fireEvent.click(tabs[1]!);

    expect(tabs[1]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveAttribute("aria-selected", "false");
    expect(screen.getByText("Nội dung thẻ 2")).toBeInTheDocument();
    expect(screen.queryByText("Nội dung thẻ 1")).not.toBeInTheDocument();
  });

  it("handles keyboard navigation via ArrowRight and ArrowLeft", () => {
    renderTabs();

    const tablist = screen.getByRole("tablist");
    const tabs = screen.getAllByRole("tab");

    tabs[0]!.focus();

    // ArrowRight -> tab 2
    fireEvent.keyDown(tablist, { key: "ArrowRight" });
    expect(tabs[1]).toHaveAttribute("aria-selected", "true");

    // ArrowRight -> tab 3
    fireEvent.keyDown(tablist, { key: "ArrowRight" });
    expect(tabs[2]).toHaveAttribute("aria-selected", "true");

    // ArrowRight wrap around -> tab 1
    fireEvent.keyDown(tablist, { key: "ArrowRight" });
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");

    // ArrowLeft wrap around -> tab 3
    fireEvent.keyDown(tablist, { key: "ArrowLeft" });
    expect(tabs[2]).toHaveAttribute("aria-selected", "true");
  });

  it("handles Home and End keys", () => {
    renderTabs();

    const tablist = screen.getByRole("tablist");
    const tabs = screen.getAllByRole("tab");

    tabs[1]!.focus();

    // End -> last tab
    fireEvent.keyDown(tablist, { key: "End" });
    expect(tabs[2]).toHaveAttribute("aria-selected", "true");

    // Home -> first tab
    fireEvent.keyDown(tablist, { key: "Home" });
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
  });
});
