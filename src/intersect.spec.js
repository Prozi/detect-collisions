const {
  System,
  Box,
  Line,
  Circle,
  intersectLineLine,
  intersectLineCircle,
  circleOutsidePolygon,
} = require(".");

describe("GIVEN Intersect Utils", () => {
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

  it("THEN case3", () => {
    const system = new System();
    const box1 = new Box({ x: 115, y: 152 }, 100, 100);
    const circle1 = new Circle({ x: 100, y: 100 }, 50);
    system.insert(box1);
    system.insert(circle1);

    expect(circleOutsidePolygon(circle1, box1)).toBe(true);
  });
});
