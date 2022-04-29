require("pixi-shim");

describe("GIVEN Ellipse", () => {
  describe("AND you adjust radiusX", () => {
    it("THEN it gives correct collision results", () => {
      const { System } = require("../../dist/");

      const system = new System();
      const ellipse = system.createEllipse({ x: 0, y: 0 }, 10, 30);

      system.createEllipse({ x: 25, y: 0 }, 10, 30);

      let collisions = 0;

      system.checkAll(() => {
        collisions++;
      });

      expect(collisions).toBe(0);

      ellipse.radiusX = 20;

      system.checkAll(() => {
        collisions++;
      });

      expect(collisions).toBe(0);

      ellipse.updateAABB();

      system.checkAll(() => {
        collisions++;
      });

      expect(collisions).toBe(2);
    });
  });

  describe("AND you adjust radiusY", () => {
    it("THEN it gives correct collision results", () => {
      const { System } = require("../../dist/");

      const system = new System();
      const ellipse = system.createEllipse({ x: 0, y: 0 }, 30, 10);

      system.createEllipse({ x: 0, y: 25 }, 30, 10);

      let collisions = 0;

      system.checkAll(() => {
        collisions++;
      });

      expect(collisions).toBe(0);

      ellipse.radiusY = 20;

      system.checkAll(() => {
        collisions++;
      });

      expect(collisions).toBe(0);

      ellipse.updateAABB();

      system.checkAll(() => {
        collisions++;
      });

      expect(collisions).toBe(2);
    });
  });

  describe("AND two ellipses perfectly overlap", () => {
    it("THEN they give correct collision results", () => {
      const { System } = require("../../dist/");

      const system = new System();

      system.createEllipse({ x: 0, y: 0 }, 10, 30);
      system.createEllipse({ x: 0, y: 0 }, 10, 30);

      system.checkAll((result) => {
        expect(result.aInB || result.bInA).toBeTruthy();
      });
    });
  });
});
