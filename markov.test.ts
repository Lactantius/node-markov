const { makeText, makeChains } = require("./markov");

describe("makeText", () => {
  test("makeText stops after given numbers of words", () => {
    const chain = makeChains(["the", "cat", "the"]);
    expect(makeText(chain, 5).split(" ").length).toEqual(5); // The array has a trailing empty string;
  });
});

describe("makeChains", () => {
  test("makeChains makes properly makes a simple chain", () => {
    const chain = makeChains(["the", "cat", "the"]);
    expect(chain).toEqual({ the: ["cat"], cat: ["the"] });
  });
});