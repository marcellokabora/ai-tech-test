import { describe, expect, it } from "vitest";
import { applyFilter } from "../src/filter.js";

const users = [
  { location: { city: "Charleston" }, dob: { age: 41 } },
  { location: { city: "London" }, dob: { age: 25 } },
  { location: { city: "charleston" }, dob: { age: 35 } }
];

describe("applyFilter", () => {
  it("filters age ranges inclusively", () => {
    expect(applyFilter(users, { field: "age", operator: "between", min: 25, max: 35 })).toHaveLength(2);
  });
  it("matches cities case-insensitively", () => {
    expect(applyFilter(users, { field: "city", operator: "eq", value: "CHARLESTON" })).toHaveLength(2);
  });
});
