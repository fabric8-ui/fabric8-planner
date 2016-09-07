describe("1st Tests", () => {
  it("true is true", () => expect(true).toEqual(true));
  it("null is not the same thing as undefined", () => {
    expect(null).not.toEqual(undefined);
  });
});
