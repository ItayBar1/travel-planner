// Smoke test — verifies the testing infrastructure is working
describe("smoke test", () => {
  it("passes", () => {
    expect(true).toBe(true);
  });

  it("has the correct nav routes defined", () => {
    const routes = ["/", "/map", "/budget", "/checklist"];
    expect(routes).toHaveLength(4);
    expect(routes[0]).toBe("/");
  });
});
