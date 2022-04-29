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
});
