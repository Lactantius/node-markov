/** Textual markov chain generator */

class MarkovMachine {
  words: string[];

  /** build markov machine; read in text.*/

  constructor(text: string) {
    let words = text.split(/[ \r\n]+/);
    this.words = words.filter((c) => c !== "");
    this.makeChains();
  }

  /** set markov chains:
   *
   *  for text of "the cat in the hat", chains will be
   *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */

  makeChains() {
    // this.words.reduce((chain, word, i) => {
    //   return chain.word
    //     ? chain[word].push(words[i + i])
    //     : (chain[word] = [words[i + 1]]);
    // }, {}: Chain);
  }

  /** return random text from chains */

  makeText(numWords = 100) {
    // TODO
  }
}

interface Chain {
  [index: string]: string[];
}

function makeChains(words: string[]): Chain {
  return words.reduce(addToChain, <Chain>{});
}

function addToChain(
  chain: Chain,
  word: string,
  i: number,
  words: string[]
): Chain {
  const nextWord = words[i + 1];
  if (chain[word]) {
    const wordArr =
      chain[word].indexOf(nextWord) !== -1
        ? chain[word]
        : chain[word].concat(nextWord);
    chain[word] = wordArr;
    return chain;
  } else {
    const wordArr = [nextWord];
    chain[word] = wordArr;
    return chain;
  }
}

console.log(makeChains(["the", "cat", "in", "the", "hat"]));

export { MarkovMachine };
