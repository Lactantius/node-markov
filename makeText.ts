/** Command-line tool to generate Markov text. */


import { promisify } from "util";
import { readFile, writeFile } from "fs";
import { splitInput, makeText, makeChains } from "./markov"

const promiseFile = promisify(readFile);

function cat(path: string) {
  return promiseFile(path, "utf8")
    .then((data) => data)
    .catch((err) => err);
}

function webCat(path: string): Promise<string | Error> {
  return fetch(path)
    .then((res) => res.text())
    .then((text) => text)
    .catch((err) => err);
}

async function main(args: string[]) {
  if (args[2] === "--out") {
    const text = await getData(args[2]);
    writeFile(args[3], makeText(makeChains(splitInput(text))), (err) =>
      err ? console.log(err) : console.log("File saved successfully")
    );
  } else {
    const text = await getData(args[2]);
    console.log(makeText(makeChains(splitInput(text))))
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
