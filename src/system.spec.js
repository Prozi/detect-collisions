require("pixi-shim");

const expectToBeNear = (value, check, tolerance = 1) => {
  expect(value).toBeGreaterThan(check - tolerance);
  expect(value).toBeLessThan(check + tolerance);
};

describe("GIVEN System", () => {
  describe("WHEN raycast is called", () => {
    it("THEN works correctly on Oval", () => {
      const { System } = require("../dist/");

      const system = new System();

      system.createOval({ x: 100, y: 100 }, 30);

      const hit = system.raycast({ x: 0, y: 0 }, { x: 100, y: 100 });

      expectToBeNear(hit.point.x, 70, 10);
      expectToBeNear(hit.point.y, 70, 10);
    });

    it("THEN works correctly on Box", () => {
      const { System } = require("../dist/");

      const system = new System();

      system.createBox({ x: 50, y: 50 }, 100, 100);

      const hit = system.raycast({ x: 0, y: 0 }, { x: 100, y: 100 });

      expect(hit.point.x).toBe(50);
      expect(hit.point.y).toBe(50);
    });

    it("THEN works correctly on Polygon", () => {
      const { System } = require("../dist/");

      const system = new System();

      system.createPolygon({ x: 50, y: 50 }, [
        { x: 50, y: 50 },
        { x: 150, y: 50 },
        { x: 150, y: 150 },
        { x: 50, y: 150 },
      ]);

      const hit = system.raycast({ x: 0, y: 0 }, { x: 100, y: 100 });

      expect(hit.point.x).toBe(100);
      expect(hit.point.y).toBe(100);
    });

    it("THEN works correctly on Line", () => {
      const { System } = require("../dist/");

      const system = new System();

      system.createLine({ x: 100, y: 0 }, { x: 0, y: 100 });

      const hit = system.raycast({ x: 0, y: 0 }, { x: 100, y: 100 });

      expect(hit.point.x).toBe(50);
      expect(hit.point.y).toBe(50);
    });

    it("THEN works correctly on Point", () => {
      const { System } = require("../dist/");

      const system = new System();

      system.createPoint({ x: 50, y: 50 });

      const hit = system.raycast({ x: 0, y: 0 }, { x: 100, y: 100 });

      expect(hit.point.x).toBe(50);
      expect(hit.point.y).toBe(50);
    });

    it("THEN works correctly on Circle", () => {
      const { System } = require("../dist/");

      const system = new System();

      system.createCircle({ x: 100, y: 100 }, 30);

      const hit = system.raycast({ x: 0, y: 0 }, { x: 100, y: 100 });

      expectToBeNear(hit.point.x, 70, 10);
      expectToBeNear(hit.point.y, 70, 10);
    });
  });
});
