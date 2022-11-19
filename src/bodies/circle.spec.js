require("pixi-shim");

describe("GIVEN Circle", () => {
  describe("AND you adjust radius", () => {
    it("THEN it gives correct collision results", () => {
      const { System } = require("../../src");

      const physics = new System();
      const circle = physics.createCircle({ x: 0, y: 0 }, 10);

      physics.createCircle({ x: 25, y: 0 }, 10);

      let collisions = 0;

      physics.checkAll(() => {
        collisions++;
      });

      expect(collisions).toBe(0);

      circle.r = 20;

      physics.checkAll(() => {
        collisions++;
      });

      expect(collisions).toBe(0);

      physics.insert(circle);
      physics.checkAll(() => {
        collisions++;
      });

      expect(collisions).toBe(2);
    });
  });

  describe("AND two circles perfectly overlap", () => {
    it("THEN they give correct collision results", () => {
      const { System } = require("../../src");
      const physics = new System();

      physics.createCircle({ x: 0, y: 0 }, 10);
      physics.createCircle({ x: 0, y: 0 }, 10);

      physics.checkAll((result) => {
        expect(result.aInB).toBeTruthy();
        expect(result.bInA).toBeTruthy();
      });
    });
  });

  describe("AND you set options", () => {
    it("THEN the parameters are set", () => {
      const { System } = require("../../src");
      const physics = new System();
      const body = physics.createCircle({}, 10, {
        isStatic: true,
        isTrigger: true,
      });

      expect(body.isStatic).toBe(true);
      expect(body.isTrigger).toBe(true);
    });
  });

  describe("AND you scale it", () => {
    it("THEN you can get and set scale, scaleX, scaleY", () => {
      const { System } = require("../../src");
      const physics = new System();
      const body = physics.createCircle({ x: 0, y: 0 }, 9);

      body.scale = 4;
      expect(body.scale).toBe(4);

      body.setScale(Math.PI, 3);
      expect(body.scaleX).toBe(Math.PI);
      expect(body.scaleY).toBe(Math.PI);
    });
  });
});
