import { describe, expect, it } from "vitest";
import { formatDate, formatLoad, percent } from "../formatters";

describe("formatDate", () => {
  it("formats ISO strings", () => {
    const formatted = formatDate("2024-02-03T10:30:00.000Z", "yyyy-MM-dd");
    expect(formatted).toBe("2024-02-03");
  });

  it("handles Date instances", () => {
    const date = new Date("2024-06-15T12:00:00.000Z");
    expect(formatDate(date, "MMM d, yyyy")).toBe("Jun 15, 2024");
  });
});

describe("formatLoad", () => {
  it("returns placeholder when value is missing", () => {
    expect(formatLoad(null)).toBe("-");
    expect(formatLoad(undefined)).toBe("-");
  });

  it("formats kilograms by default", () => {
    expect(formatLoad(82.34)).toBe("82.3 kg");
  });

  it("converts to pounds when requested", () => {
    const result = formatLoad(100, "lb");
    expect(result).toBe("220.5 lb");
  });
});

describe("percent", () => {
  it("formats a value as a percent", () => {
    expect(percent(0.875)).toBe("88%");
  });

  it("supports custom precision", () => {
    expect(percent(Math.PI / 10, 2)).toBe("31.42%");
  });
});
