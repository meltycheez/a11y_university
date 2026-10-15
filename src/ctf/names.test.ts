import { expect, it } from "vitest";
import { isBlockedName } from "./names";
import { checkStart } from "./store";

it("blocks offensive names, with simple character swaps, but not real names that contain a short word", () => {
  for (const n of ["shit", "Sh1t head", "f.u.c.k", "big ass", "a$$", "B!TCH"]) expect(isBlockedName(n), n).toBe(true);
  for (const n of ["Cassidy", "Hancock", "Sussex", "Scunthorpe", "Dickens", "Whit", "Ada", "Grape"]) expect(isBlockedName(n), n).toBe(false);
  expect(checkStart("map-eyes", "sh!t")).toBe("name");
});
