require("pixi-shim");

describe("GIVEN Circle", () => {
  describe("AND you adjust radius", () => {
    it("THEN it gives correct collision results", () => {
      const { System } = require("../../dist/");

      const system = new System();
      const circle = system.createCircle({ x: 0, y: 0 }, 10);

      system.createCircle({ x: 25, y: 0 }, 10);

      let collisions = 0;

      system.checkAll(() => {
        collisions++;
      });

      expect(collisions).toBe(0);

      circle.r = 20;

      system.checkAll(() => {
        collisions++;
      });

      expect(collisions).toBe(0);

      circle.updateAABB();

      system.checkAll(() => {
        collisions++;
      });

      expect(collisions).toBe(2);
    });
  });

  describe("AND two circles perfectly overlap", () => {
    it("THEN they give correct collision results", () => {
      const { System } = require("../../dist/");

      const system = new System();

      system.createCircle({ x: 0, y: 0 }, 10);
      system.createCircle({ x: 0, y: 0 }, 10);

      system.checkAll((result) => {
        expect(result.aInB).toBeTruthy();
        expect(result.bInA).toBeTruthy();
      });
    });
  });
});
