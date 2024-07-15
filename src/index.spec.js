describe("GIVEN Index", () => {
  it("THEN requiring it doesnt throw exception", () => {
    const req = () => require("../src");

    expect(req).not.toThrow();
  });
});
