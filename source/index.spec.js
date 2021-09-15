const { Collisions, Result, SAT } = require(".");

describe("GIVEN a world with a polygon", () => {
  it("THEN collides with a circle", () => {
    const world = new Collisions();
    world.createCircle(0, 0, 100);
    const rect = world.createPolygon(0, 0, [
      [0, 0],
      [1000, 0],
      [1000, 1000],
      [0, 1000],
    ]);

    expect(world.potentials(rect).length).toBe(1);
  });

  it("THEN collides with two circles", () => {
    const world = new Collisions();
    world.createCircle(0, 0, 100);
    world.createCircle(0, 0, 100);
    const rect = world.createPolygon(0, 0, [
      [0, 0],
      [1000, 0],
      [1000, 1000],
      [0, 1000],
    ]);

    expect(world.potentials(rect).length).toBe(2);
  });

  it("THEN collides with two circles at same place", () => {
    const world = new Collisions();
    const c1 = world.createCircle(0, 0, 50);
    const c2 = world.createCircle(0, 0, 100);
    const result = new Result();

    [c1, c2].forEach((body) => {
      new SAT(body, body === c1 ? c2 : c1, result);

      expect(result.a_in_b).toBe(body === c1);
      expect(result.b_in_a).toBe(body === c2);
      expect(result.overlap).toBe(150);
    });

    [c1, c2].forEach((body) => {
      new SAT(body, body === c1 ? c2 : c1, result);

      body.x -= result.overlap * result.overlap_x;
      body.y -= result.overlap * result.overlap_y;
    });

    world.update();

    new SAT(c1, c2, result);

    expect(c1.x).toBe(-150);
    expect(c2.x).toBe(0);
  });
});
