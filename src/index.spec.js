require("pixi-shim");

describe("GIVEN System", () => {
  it("THEN requiring it doesnt throw exception", () => {
    const req = () => require("../dist/");

    expect(req).not.toThrow();
  });

  it("THEN you can change position within tree", () => {
    const { System } = require("../dist/");

    const system = new System();
    const circle = system.createCircle({ x: 0, y: 0 }, 10);

    expect(circle.x).toBe(0);
    expect(circle.y).toBe(0);

    expect(circle.system).toBe(system);

    circle.setPosition(1, -1);

    expect(circle.pos.x).toBe(1);
    expect(circle.pos.y).toBe(-1);
  });
});
