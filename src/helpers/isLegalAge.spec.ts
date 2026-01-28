import { isLegalAge } from "./isLegalAge";

const birthDateLegal = "2004-01-04";
const birthDateILegal = "2026-01-04";

describe("Should return true if is legal", () => {
  it("if age >= 18", () => {
    const flagLegal = isLegalAge(birthDateLegal);
    expect(flagLegal).toBe(true);
  });
});

describe("Should return if is not legal", () => {
  it("if age <= 18", () => {
    const flagIlegal = isLegalAge(birthDateILegal);
    expect(flagIlegal).toBe(false);
  });
});
