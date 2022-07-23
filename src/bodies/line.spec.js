require("pixi-shim");

describe("GIVEN Line", () => {
  it("THEN without constructor values it throws", () => {
    const { Line } = require("../../dist");

    const case1 = () => new Line({});

    expect(case1).toThrow();
  });

  it("THEN two lines collide", () => {
    const { System, Line } = require("../../dist");

    const system = new System();
    const line1 = new Line({ x: -10, y: -10 }, { x: 10, y: 10 });
    const line2 = new Line({ x: 10, y: -10 }, { x: -10, y: 10 });

    system.insert(line1);
    system.insert(line2);

    let results = 0;

    line1.updateAABB();
    line2.updateAABB();

    system.checkAll(() => {
      results++;
    });

    expect(results).toBeGreaterThan(0);
  });

  describe("AND you set options", () => {
    it("THEN the parameters are set", () => {
      const { System } = require("../../dist/");
      const system = new System();
      const body = system.createLine(
        { x: 0, y: 0 },
        { x: 10, y: 0 },
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
