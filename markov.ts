/** Textual markov chain generator */

import { Either, left, right } from "fp-ts/Either";

function splitInput(text: string): Either<string, string[]> {
  const words = text.split(/[ \r\n]+/).filter((c) => c !== "");
  const either =
    words.length > 0 ? right(words) : left("No valid words for a Markov chain");
  return either;
}

interface Chain {
  [index: string]: string[];
}

function makeChains(words: string[]): Either<string, Chain> {
  const chain = Array.from(words).reduce(addToChain, <Chain>{});
  const either =
    Object.keys(chain).length > 0 ? right(chain) : left("Chain is empty");
  return either;
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

function makeText(
  chain: Chain,
  numWords: number = 100
): Either<string, string> {
  const start = pickKey(chain);
  return right(extendText(start, chain, numWords).slice(0, -1)); // Otherwise ends with a space char
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
}

function pickElement<T>(arr: Array<T>): T {
  return arr[(arr.length * Math.random()) << 0];
}

export { splitInput, makeText, makeChains };
