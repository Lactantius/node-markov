const { main, cat, webCat } = require("./makeText");

describe("cat", () => {
  test("cat returns file as string", async () => {
    const text = (await cat("eggs.txt")).right;
    expect(text).toContain("Sam I am");
  });
});

describe("webCat", () => {
  test("webCat returns webpage as string", async () => {
    const text = (await webCat("https://makeheadlines.gerardkeiser.com")).right;
    expect(text).toContain("Make Headlines");
  });
});
