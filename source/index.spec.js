const { Collisions } = require(".");

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
});
