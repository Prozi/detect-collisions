require("pixi-shim");

const expectToBeNear = (value, check, tolerance = 1) => {
  expect(value).toBeGreaterThan(check - tolerance);
  expect(value).toBeLessThan(check + tolerance);
};

describe("GIVEN System", () => {
  it("THEN collides precisely with both colliders at the same time", () => {
    const { System } = require(".");
    const physics = new System();
    const testBox = physics.createBox({ x: -5, y: -5 }, 25, 25, {
      isCentered: true,
    });
    const lineBottom = physics.createLine(
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { isStatic: true },
    );
    const lineDiagonal = physics.createLine(
      { x: 0, y: 0 },
      { x: 50, y: 50 },
      { isStatic: true },
    );

    lineBottom.isWall = true;
    lineDiagonal.isWall = true;
    testBox.isPlayer = true;

    // <-- you need to sum the negative offsets
    const aggregated = [];

    // <-- the test
    physics.checkAll(({ a, b, overlapV }) => {
      if (a.isPlayer && b.isWall) {
        aggregated.push({ x: overlapV.x, y: overlapV.y });
      }
    });

    // <-- substract the offsets
    testBox.pos.x -= aggregated.reduce((sum, overlap) => sum + overlap.x, 0);
    testBox.pos.y -= aggregated.reduce((sum, overlap) => sum + overlap.y, 0);

    // <-- after it's done update body
    testBox.updateBody();

    // <-- works
    physics.checkAll(({ a, b }) => {
      console.log({ a: a.pos, b: b.pos });

      // <-- doesn't collide or run this code
      expect(true).toBe(false);
    });
  });

  it("THEN you can change position within tree", () => {
    const { System } = require(".");

    const physics = new System();
    const circle = physics.createCircle({ x: 0, y: 0 }, 10);

    expect(circle.x).toBe(0);
    expect(circle.y).toBe(0);

    expect(circle.system).toBe(physics);

    circle.setPosition(1, -1);

    expect(circle.pos.x).toBe(1);
    expect(circle.pos.y).toBe(-1);
  });

  it("THEN update() un-dirties the bodies", () => {
    const { System } = require("../src");

    const system = new System();
    const poly = system.createPolygon({ x: -100, y: -100 }, [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
    ]);

    poly.setPosition(poly.x + 100, poly.y + 100, false);
    expect(poly.dirty).toBe(true);
    system.update();
    expect(poly.dirty).toBe(false);
  });

  describe("WHEN raycast is called", () => {
    it("THEN works correctly on Ellipse", () => {
      const { System } = require(".");
      const physics = new System();

      physics.createEllipse({ x: 100, y: 100 }, 30);

      const hit = physics.raycast({ x: 0, y: 0 }, { x: 100, y: 100 });

      expectToBeNear(hit.point.x, 70, 10);
      expectToBeNear(hit.point.y, 70, 10);
    });

    it("THEN works correctly on Box", () => {
      const { System } = require(".");
      const physics = new System();

      const box = physics.createBox({ x: 50, y: 50 }, 100, 100);
      const hit = physics.raycast({ x: 0, y: 0 }, { x: 100, y: 100 });

      expect(hit.point.x).toBe(50);
      expect(hit.point.y).toBe(50);
    });

    it("THEN works correctly on Polygon", () => {
      const { System } = require(".");
      const physics = new System();

      physics.createPolygon({ x: 50, y: 50 }, [
        { x: 50, y: 50 },
        { x: 150, y: 50 },
        { x: 150, y: 150 },
        { x: 50, y: 150 },
      ]);

      const hit = physics.raycast({ x: 0, y: 0 }, { x: 100, y: 100 });

      expect(hit.point.x).toBe(100);
      expect(hit.point.y).toBe(100);
    });

    it("THEN works correctly on Line", () => {
      const { System } = require(".");
      const physics = new System();

      physics.createLine({ x: 100, y: 0 }, { x: 0, y: 100 });

      const hit = physics.raycast({ x: 0, y: 0 }, { x: 100, y: 100 });

      expect(hit.point.x).toBe(50);
      expect(hit.point.y).toBe(50);
    });

    it("THEN works correctly on Point", () => {
      const { System } = require(".");
      const physics = new System();

      physics.createPoint({ x: 50, y: 50 });

      const hit = physics.raycast({ x: 0, y: 0 }, { x: 100, y: 100 });

      expect(hit.point.x).toBe(50);
      expect(hit.point.y).toBe(50);
    });

    it("THEN works correctly on Circle", () => {
      const { System } = require(".");
      const physics = new System();

      physics.createCircle({ x: 100, y: 100 }, 30);

      const hit = physics.raycast({ x: 0, y: 0 }, { x: 100, y: 100 });

      expectToBeNear(hit.point.x, 70, 10);
      expectToBeNear(hit.point.y, 70, 10);
    });
  });
});
