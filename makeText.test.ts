const { main, cat, webCat } = require("./makeText");

describe("cat", () => {
  test("cat returns file as string", async () => {
    const text = (await cat("eggs.txt")).right;
    expect(text).toContain("Sam I am");
  });

  test("cat returns appropriate error message", async () => {
    const err = (await cat("invalid")).left;
    expect(err).toEqual("ENOENT: no such file or directory, open 'invalid'");
  });
});

describe("webCat", () => {
  test("webCat returns webpage as string", async () => {
    const text = (await webCat("https://makeheadlines.gerardkeiser.com")).right;
    expect(text).toContain("Make Headlines");
  });

  test("webCat returns appropriate error message", async () => {
    const err = (await webCat("invalid")).left;
    expect(err).toEqual("Website unavailable: 'invalid'");
  });
});
