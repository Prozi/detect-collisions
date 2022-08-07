require("pixi-shim");

describe("GIVEN Polygon", () => {
  it("THEN you need at least one point to create", () => {
    const { Polygon } = require("../../dist/");

    const nullParams = () => new Polygon({});
    const zeroParams = () => new Polygon({}, []);
    const oneParam = () => new Polygon({}, [{}]);

    expect(nullParams).toThrow();
    expect(zeroParams).toThrow();
    expect(oneParam).not.toThrow();
  });

  it("THEN you can set position by setting x & y", () => {
    const { Polygon } = require("../../dist/");

    const poly = new Polygon({}, [{}]);

    poly.x = 10;
    poly.y = 10;

    expect(poly.pos.x).toBe(10);
    expect(poly.pos.y).toBe(10);
  });

  it("THEN you can set position by setPosition()", () => {
    const { Polygon } = require("../../dist/");

    const poly = new Polygon({}, [{}]);

    poly.setPosition(10, 10);

    expect(poly.pos.x).toBe(10);
    expect(poly.pos.y).toBe(10);
  });

  describe("AND you set options", () => {
    it("THEN the parameters are set", () => {
      const { System } = require("../../dist/");
      const physics = new System();
      const body = physics.createPolygon({}, [{}], {
        isStatic: true,
        isTrigger: true,
      });

      expect(body.isStatic).toBe(true);
      expect(body.isTrigger).toBe(true);
    });
  });

  let polygonPoints;

  beforeEach(() => {
    polygonPoints = [
      {
        x: 2,
        y: 5,
      },
      {
        x: 180,
        y: -59,
      },
      {
        x: 177,
        y: -69,
      },
      {
        x: -2,
        y: -5,
      },
    ];
  });

  describe("AND has clockwise points", () => {
    it("THEN it collides properly", () => {
      const { System } = require("../../dist/");
      const physics = new System();
      const circle = physics.createCircle(
        {
          x: -1311,
          y: 1642,
        },
        3
      );

      const polygon = physics.createPolygon(
        {
          x: -1418,
          y: 1675,
        },
        polygonPoints
      );

      expect(physics.checkCollision(circle, polygon)).toBe(true);
    });
  });

  describe("AND has counter-clockwise points", () => {
    it("THEN it collides properly", () => {
      const { System } = require("../../dist/");
      const physics = new System();
      const circle = physics.createCircle(
        {
          x: -1311,
          y: 1642,
        },
        3
      );

      const polygon = physics.createPolygon(
        {
          x: -1418,
          y: 1675,
        },
        polygonPoints.reverse()
      );

      expect(physics.checkCollision(circle, polygon)).toBe(true);
    });
  });

  describe("AND is concave (not convex) polygon", () => {
    it("THEN it collides properly", () => {
      const { System } = require("../../dist/");
      const physics = new System();
      const concave = physics.createPolygon({ x: 0, y: 0 }, [
        { x: 190, y: 147 },
        { x: 256, y: 265 },
        { x: 400, y: 274 },
        { x: 360, y: 395 },
        { x: 80, y: 350 },
      ]);
      const convex = physics.createPolygon({ x: 0, y: 0 }, [
        { x: 273, y: 251 },
        { x: 200, y: 120 },
        { x: 230, y: 40 },
        { x: 320, y: 10 },
        { x: 440, y: 86 },
        { x: 440, y: 220 },
      ]);

      const collide = physics.checkCollision(concave, convex);

      expect(collide).toBe(false);
    });
  });
});
