require("pixi-shim");

describe("GIVEN Stress test", () => {
  it("THEN requiring it doesnt throw exception", () => {
    const req = () => require("./stress");

    expect(req).not.toThrow();
  });

  describe("AND Stress is instantiated", () => {
    it("THEN it doesnt throw exception", () => {
      const { Stress } = require("./stress");
      const create = () => new Stress();

      expect(create).not.toThrow();
    });
  });
});
