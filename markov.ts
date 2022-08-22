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

/*
 * TODO Figure out some way to not mutate the original chain, remove some logic to separate function
 */
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
    chain[word] = wordArr.filter((word) => word); // Remove undefined
    return chain;
  } else {
    const wordArr = [nextWord];
    chain[word] = wordArr.filter((word) => word);
    return chain;
  }
}

function makeText(chain: Chain, numWords: number = 100): string {
  const start = pickKey(chain);
  return extendText(start, chain, numWords).slice(0, -1); // Otherwise ends with a space char
}

/*
 * TODO account for punctuation, use lazy eval, prevent space at end
 */
function extendText(word: string, chain: Chain, wordsLeft: number): string {
  if (chain[word] && wordsLeft > 0) {
    return `${word} ${extendText(
      pickElement(chain[word]),
      chain,
      wordsLeft - 1
    )}`;
  } else {
    return ""; // End when a word maps to an empty array.
  }
}

/*
 * Edited from https://stackoverflow.com/a/15106541/6632828
 */
function pickKey(obj: Object) {
  const keys = Object.keys(obj);
  return pickElement(keys);
  // return keys[(keys.length * Math.random()) << 0];
}

function pickElement<T>(arr: Array<T>): T {
  return arr[(arr.length * Math.random()) << 0];
}

// const chain = makeChains(["the", "cat", "in", "the", "hat"]);
// console.log(chain);
// console.log(makeText(chain));

// const infChain = makeChains(["the", "cat", "the"]);
// console.log(infChain);
// console.log(makeText(infChain));

export { MarkovMachine, makeText, makeChains };
