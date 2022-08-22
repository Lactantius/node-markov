/** Command-line tool to generate Markov text. */

import { promisify } from "util";
import { readFile, writeFile } from "fs";
import { splitInput, makeText, makeChains } from "./markov";
import { pipe } from "fp-ts/function";
import { Either, right, left, chain } from "fp-ts/Either";

const promiseFile = promisify(readFile);

function cat(path: string): Promise<Either<string, string>> {
  return promiseFile(path, "utf8")
    .then((data) => right(data))
    .catch((err) => left("File could not be read"));
}

function webCat(path: string): Promise<Either<string, string>> {
  return fetch(path)
    .then((res) => res.text())
    .then((text) => right(text))
    .catch((err) => left("Website unavailable."));
}

async function main(args: string[]) {
  const text = await getData(args[2]);
  if (args[2] === "--out") {
    return;
    // writeFile(args[3], makeText(makeChains(splitInput(text))), (err) =>
    //   err ? console.log(err) : console.log("File saved successfully")
    // );
  } else {
    console.log(
      pipe(text, chain(splitInput), chain(makeChains), chain(makeText))
    );
  }
}

async function getData(resource: string) {
  if (resource.slice(0, 4) === "http") {
    return await webCat(resource);
  } else {
    return await cat(resource);
  }
}

if (require.main === module) {
  main(process.argv);
}

export { main, cat, webCat };
