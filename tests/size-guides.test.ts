import { describe, expect, it } from "vitest";

import { getSizeGuideHref } from "@/lib/size-guides";

describe("getSizeGuideHref", () => {
  it("links footwear to the shoe size guide", () => {
    expect(getSizeGuideHref(["footwear"])).toBe("/size-guide/shoes");
  });

  it.each(["belts", "wallets", "bags"])("has no guide for %s", (handle) => {
    expect(getSizeGuideHref([handle])).toBeNull();
  });

  it("uses the first matching collection and ignores unknown ones", () => {
    expect(getSizeGuideHref(["frontpage", "footwear", "belts"])).toBe(
      "/size-guide/shoes",
    );
  });

  it("returns null for no collections", () => {
    expect(getSizeGuideHref([])).toBeNull();
  });
});
