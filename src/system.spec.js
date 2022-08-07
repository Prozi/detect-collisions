require("pixi-shim");

const expectToBeNear = (value, check, tolerance = 1) => {
  expect(value).toBeGreaterThan(check - tolerance);
  expect(value).toBeLessThan(check + tolerance);
};

describe("GIVEN System", () => {
  it("THEN you can change position within tree", () => {
    const { System } = require("../dist/");

    const physics = new System();
    const circle = physics.createCircle({ x: 0, y: 0 }, 10);

    expect(circle.x).toBe(0);
    expect(circle.y).toBe(0);

    expect(circle.system).toBe(physics);

    circle.setPosition(1, -1);

    expect(circle.pos.x).toBe(1);
    expect(circle.pos.y).toBe(-1);
  });

  describe("WHEN raycast is called", () => {
    it("THEN works correctly on Ellipse", () => {
      const { System } = require("../dist/");

      const physics = new System();

      physics.createEllipse({ x: 100, y: 100 }, 30);

      const hit = physics.raycast({ x: 0, y: 0 }, { x: 100, y: 100 });

      expectToBeNear(hit.point.x, 70, 10);
      expectToBeNear(hit.point.y, 70, 10);
    });

    it("THEN works correctly on Box", () => {
      const { System } = require("../dist/");

      const physics = new System();

      const box = physics.createBox({ x: 50, y: 50 }, 100, 100);
      const hit = physics.raycast({ x: 0, y: 0 }, { x: 100, y: 100 });

      expect(hit.point.x).toBe(50);
      expect(hit.point.y).toBe(50);
    });

    it("THEN works correctly on Polygon", () => {
      const { System } = require("../dist/");

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
      const { System } = require("../dist/");

      const physics = new System();

      physics.createLine({ x: 100, y: 0 }, { x: 0, y: 100 });

      const hit = physics.raycast({ x: 0, y: 0 }, { x: 100, y: 100 });

      expect(hit.point.x).toBe(50);
      expect(hit.point.y).toBe(50);
    });

    it("THEN works correctly on Point", () => {
      const { System } = require("../dist/");

      const physics = new System();

      physics.createPoint({ x: 50, y: 50 });

      const hit = physics.raycast({ x: 0, y: 0 }, { x: 100, y: 100 });

      expect(hit.point.x).toBe(50);
      expect(hit.point.y).toBe(50);
    });

    it("THEN works correctly on Circle", () => {
      const { System } = require("../dist/");

      const physics = new System();

      physics.createCircle({ x: 100, y: 100 }, 30);

      const hit = physics.raycast({ x: 0, y: 0 }, { x: 100, y: 100 });

      expectToBeNear(hit.point.x, 70, 10);
      expectToBeNear(hit.point.y, 70, 10);
    });
  });

  it("THEN getBounceDirection works correctly", () => {
    const { System, getBounceDirection } = require("../dist/");

    const physics = new System();
    const circle = physics.createCircle({ x: 100, y: 100 }, 30);

    physics.createCircle({ x: 120, y: 100 }, 30);
    physics.checkOne(circle, ({ a, b }) => {
      const bounce = getBounceDirection(a, b);

      expect(bounce.x).toBe(-1);
      expect(bounce.y).toBe(0);
    });
  });
});
