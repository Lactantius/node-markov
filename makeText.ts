/** Command-line tool to generate Markov text. */

import { promisify } from "util";
// import { readFile, writeFile } from "fs";
import { readFile, writeFile } from "node:fs/promises"
import { splitInput, makeText, makeChains } from "./markov";
import { pipe } from "fp-ts/function";
import { Either, right, left, chain } from "fp-ts/Either";


// const promiseFile = promisify(readFile);

function cat(path: string): Promise<Either<string, string>> {
  return readFile(path, "utf8")
    .then((data) => right(data))
    .catch((err: Error) => left(err.message));
}

function webCat(path: string): Promise<Either<string, string>> {
  return fetch(path)
    .then((res) => res.text())
    .then((text) => right(text))
    .catch((err: Error) => left(`Website unavailable: '${path}'`));
}

async function main(args: string[]): Promise<void> {
  const text = await getData(args[2]);
  const pipeline = pipe(
    text,
    chain(splitInput),
    chain(makeChains),
    chain(makeText)
  );
  if (args[2] === "--out") {
    pipeline._tag === "Left"
      ? console.log(pipeline.left)
      : writeFile(args[3], pipeline.right).catch((err: Error) => console.log(err))
  } else {
    pipeline._tag === "Left"
      ? console.log(pipeline.left)
      : console.log(pipeline.right);
  }
}

async function getData(resource: string): Promise<Either<string, string>> {
  if (resource.slice(0, 4) === "http") {
    return webCat(resource);
  } else {
    return cat(resource);
  }
}

if (require.main === module) {
  main(process.argv);
}

export { main, cat, webCat };
