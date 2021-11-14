require("pixi-shim");

describe("GIVEN System", () => {
  it("THEN requiring it doesnt throw exception", () => {
    const req = () => require("../dist/");

    expect(req).not.toThrow();
  });

  describe("AND two cricles perfectly overlap", () => {
    it("THEN they give collision results", () => {
      const { System } = require("../dist/");

      const system = new System();

      system.createCircle({ x: 0, y: 0 }, 10);
      system.createCircle({ x: 0, y: 0 }, 10);

      system.checkAll((result) => {
        expect(result.aInB).toBeTruthy();
        expect(result.bInA).toBeTruthy();
      });
    });
  });
});
