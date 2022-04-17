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
});
