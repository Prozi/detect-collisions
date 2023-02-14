require("pixi-shim");

describe("GIVEN Box", () => {
  it("THEN changing width works correctly", () => {
    const { System } = require("../../src");

    const physics = new System();
    const box = physics.createBox({}, 90, 100);

    physics.createBox({ x: 100 }, 90, 100);

    let results = 0;

    physics.checkAll(() => {
      results++;
    });

    expect(results).toBe(0);

    box.width = 110;

    physics.insert(box);
    physics.checkAll(() => {
      results++;
    });

    expect(results).toBeGreaterThan(0);
  });

  it("THEN changing height works correctly", () => {
    const { System } = require("../../src");

    const physics = new System();
    const box = physics.createBox({}, 100, 90);

    physics.createBox({ y: 100 }, 100, 90);

    let results = 0;

    physics.checkAll(() => {
      results++;
    });

    expect(results).toBe(0);

    box.height = 110;

    physics.insert(box);
    physics.checkAll(() => {
      results++;
    });

    expect(results).toBeGreaterThan(0);
  });

  it("THEN getPotentials works with Box with angle", () => {
    const { System, Circle, Box } = require("../../src");

    const physics = new System();
    const circle = new Circle({ x: 100, y: 100 }, 100);
    physics.insert(circle);

    const pos = { x: 400, y: 100 };
    const circle2 = new Circle(pos, 50);
    physics.insert(circle2);

    const box = new Box({ x: 400, y: 300 }, 200, 100);
    box.setOffset({ x: 0, y: -50 });
    box.setAngle(5);
    physics.insert(box);

    let case1works = false;
    let case2works = false;

    if (physics.checkCollision(circle2, box)) {
      case1works = true;
    }

    expect(case1works).toBeTruthy();

    physics.getPotentials(circle2).forEach((collider) => {
      if (physics.checkCollision(circle2, collider)) {
        console.log("getPotentials works on Box with angle");

        case2works = true;
      }
    });

    expect(case2works).toBeTruthy();
  });

  it("THEN center() works correctly", () => {
    const { Box } = require("../../src");

    const box = new Box({}, 100, 100);

    box.isCentered = true;

    expect(box.points[0].x).toBe(-box.width / 2);
    expect(box.points[0].y).toBe(-box.height / 2);
    expect(box.x).toBe(box.width / 2);
    expect(box.y).toBe(box.height / 2);
  });

  it("THEN even without inserting to system, gives collision results", () => {
    const { Box, System } = require("../../src");

    // initialize a collision detection system
    const system = new System();

    // bounds
    const box = new Box({ x: 0, y: 0 }, 1024, 768);
    const bbox = box.getAABBAsBBox();

    // out of bound
    system.createCircle({ x: -20, y: -20 }, 10);

    // 3 bodies in bounds
    system.createCircle({ x: 10, y: 10 }, 10);
    system.createCircle({ x: 30, y: 30 }, 10);
    system.createEllipse({ x: 10, y: 60 }, 20, 10);

    // bbox is even without inserting to system
    const potentials = system.getPotentials(bbox);

    // the list of bodies colliding
    const collisions = potentials.filter((body) =>
      system.checkCollision(box, body)
    );

    // correct result is 3
    expect(collisions.length).toBe(3);
  });
});
