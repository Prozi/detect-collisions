const { Circle, getBounceDirection } = require("../");

describe("GIVEN Utils", () => {
  it("THEN getBounceDirection works correctly", () => {
    const a = new Circle({ x: 100, y: 100 }, 30);
    const b = new Circle({ x: 120, y: 100 }, 30);
    const bounce = getBounceDirection(a, b);

    expect(bounce.x).toBe(-1);
    expect(bounce.y).toBe(0);
  });
});
