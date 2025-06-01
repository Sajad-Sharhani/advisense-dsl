import readline from 'readline';
import { Parser } from "./parser/Parser";


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> ',
});

console.log('Arithmetic Expression Parser & Evaluator');
console.log("Type an expression and press Enter (e.g., 3 + 4 * (2 - 1)).");
console.log("Type 'exit' or press Ctrl+C to quit.\n");

rl.prompt();

rl.on('line', (line) => {
  const input = line.trim();
  if (input.toLowerCase() === 'exit') {
    rl.close();
    return;
  }

  try {
    const ast = Parser.parse(input);
    const result = ast.evaluate();
    console.log(`Result: ${result}`);
    console.log(`AST (print): ${ast.print()}`);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error: ${err.message}`);
    } else {
      console.error('Unknown error during parsing/evaluation');
    }
  }

  rl.prompt();
});

rl.on('close', () => {
  console.log('\nGoodbye!');
  process.exit(0);
});

