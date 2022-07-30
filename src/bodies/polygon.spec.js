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
      const system = new System();
      const body = system.createPolygon({}, [{}], {
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
      const system = new System();
      const circle = system.createCircle(
        {
          x: -1311,
          y: 1642,
        },
        3
      );

      const polygon = system.createPolygon(
        {
          x: -1418,
          y: 1675,
        },
        polygonPoints
      );

      expect(system.checkCollision(circle, polygon)).toBe(true);
    });
  });

  describe("AND has counter-clockwise points", () => {
    it("THEN it collides properly", () => {
      const { System } = require("../../dist/");
      const system = new System();
      const circle = system.createCircle(
        {
          x: -1311,
          y: 1642,
        },
        3
      );

      const polygon = system.createPolygon(
        {
          x: -1418,
          y: 1675,
        },
        polygonPoints.reverse()
      );

      expect(system.checkCollision(circle, polygon)).toBe(true);
    });
  });
});
