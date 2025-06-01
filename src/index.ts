import { Parser } from "./parser/Parser";

const examples = [
  "10 + 5",
  "(1 + 2) * 3",
  "3 + 4 * 2 / (1 - 5) + 7",
  "(2 + 3) < (4 - 1)",
];

for (const ex of examples) {
  const ast = Parser.parse(ex);
  console.log(`${ex} = ${ast.evaluate()}`);
}
