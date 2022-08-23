/** Command-line tool to generate Markov text. */

import { promisify } from "util";
// import { readFile, writeFile } from "fs";
import { readFile, writeFile } from "node:fs/promises";
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
  if (args[2] === "--out") {
    const outFile = args[3];
    const resource = args[4];
    writeData(resource, outFile);
  } else {
    const resource = args[2];
    printData(resource);
  }
}

async function printData(resource: string): Promise<void> {
  const markovText = await markovTextFromResource(resource);
  markovText._tag === "Left"
    ? console.log(markovText.left)
    : console.log(markovText.right);
}

async function writeData(resource: string, outFile: string): Promise<void> {
  const markovText = await markovTextFromResource(resource);
  markovText._tag === "Left"
    ? console.log(markovText.left)
    : writeFile(outFile, markovText.right).catch((err: Error) =>
      console.log(err)
    );
}

async function markovTextFromResource(
  resource: string
): Promise<Either<string, string>> {
  return pipe(
    await getData(resource),
    chain(splitInput),
    chain(makeChains),
    chain(makeText)
  );
}

async function getData(resource: string): Promise<Either<string, string>> {
  if (resource.startsWith("http")) {
    return webCat(resource);
  } else {
    return cat(resource);
  }
}

if (require.main === module) {
  main(process.argv);
}

export { main, cat, webCat };
