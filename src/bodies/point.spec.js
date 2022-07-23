require("pixi-shim");

describe("GIVEN Point", () => {
  it("THEN without constructor values, initializes with (0, 0)", () => {
    const { Point } = require("../../dist/");

    const point = new Point();

    expect(point.x).toBe(0);
    expect(point.y).toBe(0);
  });

  describe("AND you set options", () => {
    it("THEN the parameters are set", () => {
      const { System } = require("../../dist/");
      const system = new System();
      const body = system.createPoint(
        { x: 0, y: 0 },
        {
          isStatic: true,
          isTrigger: true,
        }
      );

      expect(body.isStatic).toBe(true);
      expect(body.isTrigger).toBe(true);
    });
  });
});
