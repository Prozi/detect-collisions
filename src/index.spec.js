require("pixi-shim");

describe("GIVEN Index", () => {
  it("THEN requiring it doesnt throw exception", () => {
    const req = () => require("../dist/");

    expect(req).not.toThrow();
  });
});
