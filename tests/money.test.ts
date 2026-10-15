import { describe, expect, it } from "vitest";

import { formatMoney } from "@/lib/utils/money";

describe("formatMoney", () => {
  it("formats as currency code, space, comma-grouped integer", () => {
    expect(formatMoney("12500.0", "PKR")).toBe("PKR 12,500");
    expect(formatMoney("1234567", "PKR")).toBe("PKR 1,234,567");
  });

  it("rounds to whole units", () => {
    expect(formatMoney("99.6", "PKR")).toBe("PKR 100");
    expect(formatMoney("0", "PKR")).toBe("PKR 0");
  });

  it("keeps a non-numeric amount readable instead of throwing", () => {
    expect(formatMoney("abc", "PKR")).toBe("PKR abc");
  });
});
