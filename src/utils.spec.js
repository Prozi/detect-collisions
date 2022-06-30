const { Circle } = require("sat");
const { Line, intersectLineLine, intersectLineCircle } = require("../dist");

describe("GIVEN Utils", () => {
  it("THEN intersectLineLine should work", () => {
    const line1 = new Line({ x: 0, y: 0 }, { x: 100, y: 100 });
    const line2 = new Line({ x: 100, y: 0 }, { x: 0, y: 100 });

    expect(intersectLineLine(line1, line2)).toStrictEqual({ x: 50, y: 50 });
  });

  it("THEN intersectLineCircle should work", () => {
    const line1 = new Line({ x: 0, y: 0 }, { x: 100, y: 100 });
    const circle1 = new Circle({ x: 50, y: 50 }, 10);

    expect(intersectLineCircle(line1, circle1).length).toBe(2);
  });
});
