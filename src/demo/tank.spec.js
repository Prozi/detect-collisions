require("pixi-shim");

describe("GIVEN Tank test", () => {
  it("THEN requiring it doesnt throw exception", () => {
    const req = () => require("./tank");

    expect(req).not.toThrow();
  });

  describe("AND Tank is instantiated", () => {
    it("THEN requiring it doesnt throw exception", () => {
      const { Tank } = require("./tank");
      const create = () => new Tank();

      expect(create).not.toThrow();
    });
  });
});
