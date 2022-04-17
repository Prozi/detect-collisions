require("pixi-shim");

describe("GIVEN Box", () => {
  it("THEN changing width works correctly", () => {
    const { System } = require("../../dist/");

    const system = new System();
    const box = system.createBox({}, 90, 100);

    system.createBox({ x: 100 }, 90, 100);

    let results = 0;

    system.checkAll(() => {
      results++;
    });

    expect(results).toBe(0);

    box.width = 110;

    system.updateBody(box);

    system.checkAll(() => {
      results++;
    });

    expect(results).toBeGreaterThan(0);
  });

  it("THEN changing height works correctly", () => {
    const { System } = require("../../dist/");

    const system = new System();
    const box = system.createBox({}, 100, 90);

    system.createBox({ y: 100 }, 100, 90);

    let results = 0;

    system.checkAll(() => {
      results++;
    });

    expect(results).toBe(0);

    box.height = 110;

    system.updateBody(box);

    system.checkAll(() => {
      results++;
    });

    expect(results).toBeGreaterThan(0);
  });

  it("THEN getPotentials works with Box with angle", () => {
    const { System, Circle, Box } = require("../../dist/");

    const system = new System();
    const circle = new Circle({ x: 100, y: 100 }, 100);

    system.insert(circle);

    const pos = { x: 400, y: 100 };
    const circle2 = new Circle(pos, 50);

    system.insert(circle2);

    const box = new Box({ x: 400, y: 300 }, 200, 100);

    box.setOffset({ x: 0, y: -50 });
    system.insert(box);

    box.setAngle(5);
    system.updateBody(box);

    let case1works = false;
    let case2works = false;

    if (system.checkCollision(circle2, box)) {
      case1works = true;
    }

    expect(case1works).toBeTruthy();

    system.getPotentials(circle2).forEach((collider) => {
      if (system.checkCollision(circle2, collider)) {
        console.log("getPotentials works on Box with angle");

        case2works = true;
      }
    });

    expect(case2works).toBeTruthy();
  });

  it("THEN center() works correctly", () => {
    const { Box } = require("../../dist/");

    const box = new Box({}, 100, 100);

    box.center();

    expect(box.points[0].x).toBe(-box.width / 2);
    expect(box.points[0].y).toBe(-box.height / 2);
    expect(box.x).toBe(box.width / 2);
    expect(box.y).toBe(box.height / 2);
  });
});
