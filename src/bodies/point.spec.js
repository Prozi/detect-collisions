require("pixi-shim");

describe("GIVEN Point", () => {
  it("THEN without constructor values, initializes with (0, 0)", () => {
    const { Point } = require("../../dist/");

    const point = new Point();

    expect(point.x).toBe(0);
    expect(point.y).toBe(0);
  });
});
