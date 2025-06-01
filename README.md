# DSL to evaluate simple mathematical expression

## Overview
This project implements a simple arithmetic expression parser and evaluator using an Abstract Syntax Tree (AST) and the Shunting-Yard algorithm. It supports basic arithmetic (`+`, `-`, `*`, `/`) as well as comparison operators (`<`, `>`, `=`). The parser converts an infix expression into Reverse Polish Notation (RPN), then builds an AST (`NumberNode` and `BinaryOperationNode`) to evaluate or print the expression.

---

## Implementation Approach
1. **AST Design**  
   - **`ASTNode` interface** defines two methods:  
     - `evaluate(): number | boolean`  
     - `print(): string`  
   - **`NumberNode`** wraps a single numeric value (leaf node).  
   - **`BinaryOperationNode`** holds a left and right `ASTNode` plus an `Operator`. During `evaluate()`, it recurses into its children, applies the operator, and returns either a number or boolean. The `print()` method returns a parenthesized string like `(left op right)`.

2. **Parsing with Shunting-Yard**  
   - **Tokenisation** strips whitespace and breaks the input string into a sequence of tokens (numbers, operators, parentheses).  
   - **Validation** checks that all parentheses are balanced (`Parser.isValid`).  
   - **Conversion to RPN** using a classic Shunting-Yard loop:  
     - Numbers go directly into an output queue.  
     - Operators are pushed onto an operator stack, popping any operators of equal or higher precedence first.  
     - Parentheses are handled by pushing `'('` and popping until `'('` when encountering `')'`.  
   - **RPN → AST**: After producing the RPN (an array of numbers and operator strings), we build the AST by scanning each token:  
     - If it’s a number, push a `NumberNode` onto an AST stack.  
     - If it’s an operator, pop two nodes (right then left), create a `BinaryOperationNode(left, right, operator)`, and push it back.  
   - The final AST stack should contain exactly one node (the root). Any mismatch or extra tokens throw an error.

3. **Evaluation and Printing**  
   - Calling `root.evaluate()` returns a `number` or `boolean`.  
   - Calling `root.print()` returns a fully parenthesized infix string (whitespace normalized).

> **Note on Operator Precedence**  
> - `*`, `/` have precedence level 2  
> - `+`, `-` have precedence level 1  
> - Comparison operators `<`, `>`, `=` are treated with the same precedence as `+`/`-` (per requirements), so chaining comparisons (e.g., `1 < 2 < 3`) is **not** specifically supported (it will either throw or be interpreted left-to-right based on implementation).

---

## Assumptions
- Input expressions only contain: digits, decimal points, the operators `+ - * / < > =`, parentheses `(` `)`, and whitespace.  
- Decimals are parsed with `parseFloat`, so malformed decimals like `1.2.3` become `1.2` (further “.3” is ignored).  
- Empty or whitespace-only input throws an error.  
- Empty parentheses (`()`) or parentheses containing only whitespace (`(  )`) are invalid.  
- Division by zero throws an `Error('Division by zero')`.  
- The parser does not support unary operators (e.g., `-3`)—you must write it as `(0 - 3)` if needed.  
- There is no support for logical chaining like `1 < 2 < 3`; comparisons return a boolean, and booleans are not treated as numeric operands for subsequent arithmetic.

---

## AI Tools & External References
> The sections below indicate content that was generated or assisted by AI tools. Any AI-generated text is clearly marked.

1. **Copilot (GitHub AI)**  
   - Assisted in writing boilerplate TypeScript classes and method signatures.  

2. **ChatGPT (OpenAI)**  
   - Generated a list of edge cases for the Vitest test suite (e.g., decimal-format edge cases, empty-input cases, malformed decimals).
   - README file

3. **Shunting-Yard Algorithm References**  
   - Wikipedia article on Shunting-Yard: https://en.wikipedia.org/wiki/Shunting_yard_algorithm  
   - YouTube tutorial: https://www.youtube.com/watch?v=Wz85Hiwi5MY  

---

## Installation & Running Instructions

1. **Prerequisites**  
   - [Node.js](https://nodejs.org/) 
   - [npm](https://www.npmjs.com/)  

2. **PNPM**
    - To install pnpm, first ensure that Node.js and npm are installed.
    - Install pnpm globally by running `sudo npm install -g pnpm`
    - Verify the installation by running `pnpm -v`

3. **Clone the Repository & Install Dependencies**  
   ```bash
   git clone https://github.com/Sajad-Sharhani/advisense-dsl.git
   cd advisense-dsl
   pnpm install
   ```

4. **Development**  
   ```bash
   pnpm dev
   ```

5. **Build (TypeScript → JavaScript)**  
   ```bash
   pnpm build
   ```

6. **Run**  
   ```bash
   pnpm start
   ```

6. **Test Suite (Vitest)**  
   ```bash
   pnpm test
   ```
