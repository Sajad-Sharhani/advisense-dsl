// ----------------------------------------------------------------------------
// @copyright    (C) 2025 Sajad Sharhani
//
// @file         Parser.ts
// @author       Sajad Sharhani <sharhani.sajad@gmail.com>
// @brief        Parser class
// @details      Parses arithmetic expressions into an AST using the shunting-yard
//               algorithm and constructs an AST with NumberNode and BinaryOperationNode
// ----------------------------------------------------------------------------

import { BinaryOperationNode } from '../ast/BinaryOperationNode';
import { NumberNode } from '../ast/NumberNode';
import { ASTNode, Operator, SerializedASTNode } from "@/types";


export class Parser {
  /**
   * @brief   Quick check that parentheses are balanced
   * @param   s       Input expression string
   * @return  True if parentheses are balanced, false otherwise
   */
  static isValid(s: string): boolean {
    const stack: string[] = [];
    const closeToOpen: Record<string, string> = { ')': '(' };

    for (const c of s) {
      if (c === '(') {
        stack.push(c);
      } else if (closeToOpen[c]) {
        // if top of stack matches the opening paren, pop it; otherwise invalid
        if (stack.length && stack[stack.length - 1] === closeToOpen[c]) {
          stack.pop();
        } else {
          return false;
        }
      }
    }
    return stack.length === 0;
  }

  /**
   * @brief   Parses an arithmetic expression into an AST
   * @param   expr        The expression string to parse
   * @return  The root ASTNode representing the parsed expression
   */
  static parse(expr: string): ASTNode {
    // remove all whitespace
    const s = expr.replace(/\s+/g, '');
    if (!this.isValid(s)) {
      throw new Error('Invalid or mismatched parentheses');
    }

    const tokens = this.tokenize(s);

     // Prepare two structures for the Shunting-Yard algorithm:
    //  outputQueue will collect our expression in Reverse Polish Notation (RPN)
    const outputQueue: (number | string)[] = [];
    //  opStack will hold operators and parentheses
    const opStack: string[] = [];

    // Shunting-Yard: convert infix tokens to RPN
    for (const tk of tokens) {
      if (typeof tk === 'number') {
        // a number goes directly to the output queue
        outputQueue.push(tk);

      } else if (this.isVaildOp(tk)) {
        // First pop any operators of higher or equal precedence and push them to the output queue
        while (
          opStack.length &&
          this.isVaildOp(opStack[opStack.length - 1]) &&
          this.precedence(opStack[opStack.length - 1]) >= this.precedence(tk)
        ) {
          const topOp = opStack.pop();
          if (!topOp) {
            throw new Error('Invalid operator stack state');
          }
          outputQueue.push(topOp);
        }
        // Then push the current operator onto the stack
        opStack.push(tk);

      } else if (tk === '(') {
        // Right parenthesis: pop until matching '('
        opStack.push(tk);

      } else {
        // tk === ')'
        while (opStack.length && opStack[opStack.length - 1] !== '(') {
          const topOp = opStack.pop();
          if (!topOp) {
            throw new Error('Invalid operator stack state');
          }
          outputQueue.push(topOp);
        }

        // Remove '('
        opStack.pop();
      }
    }

    // Drain remaining operators to output queue
    while (opStack.length) {
      const o = opStack.pop();
      if (!o) {
        throw new Error('Invalid operator stack state');
      }
      outputQueue.push(o);
    }

    // RPN → AST: Build the expression tree
    const astStack: ASTNode[] = [];
    for (const tk of outputQueue) {
      if (typeof tk === 'number') {
        astStack.push(new NumberNode(tk));

      } else {
        // Pop two operands for the operator
        const right = astStack.pop();
        const left = astStack.pop();
        if (!left || !right) {
          throw new Error('Invalid expression: not enough operands for operator');
        }
        // Create a BinaryOperationNode and push it back
        astStack.push(new BinaryOperationNode(left, right, tk as Operator));
      }
    }

    if (astStack.length !== 1) {
      throw new Error('Invalid expression');
    }

    return astStack[0];
  }

  /**
   * @brief   Tokenizes the input string into numbers, operators, and parentheses
   * @param   s       Whitespace-stripped expression string
   * @return  Array of tokens (numbers and string operators/parentheses)
   */
  private static tokenize(s: string): (number | string)[] {
    const res: (number | string)[] = [];
    let i = 0;

    while (i < s.length) {
      const c = s[i];
      
      if (/[0-9.]/.test(c)) {
        // Scan for numbers (including decimals)
        let num = '';
        while (i < s.length && /[0-9.]/.test(s[i])) {
          num += s[i++];
        }
        res.push(parseFloat(num));
      
      } else if (/[+\-*/()<>=]/.test(c)) {
        // Scan for operators and parentheses
        res.push(c);
        i++;

      } else {
        throw new Error(`Unexpected token '${c}' at position ${i}`);
      }
    }

    return res;
  }

  /**
   * @brief   Determines if a token is a valid operator
   * @param   t       The token string to test
   * @return  True if token is +, -, *, or /; false otherwise
   */
  private static isVaildOp(t: string): boolean {
    const validOpsSet = new Set(['+', '-', '*', '/', '<', '>', '=']);
    return validOpsSet.has(t);
  }

  /**
   * @brief   Returns the precedence level of an operator
   * @param   op        The operator token
   * @return  Numeric precedence
   */
  private static precedence(op: string): number {
    return op === '+' || op === '-' ? 1 : 2;
  }

  /**
   * @brief   Serializes an ASTNode into a JSON-compatible format
   * @return  SerializedASTNode representation of the node
   * @details Converts the node into a format suitable for storage or transmission
   */
  static deserialize(serial: SerializedASTNode): ASTNode {
    switch (serial.type) {
      case 'NumberNode':
        return new NumberNode(serial.value);

      case 'BinaryOperationNode':
        // Recurse into left/right subtrees
        const leftNode = Parser.deserialize(serial.left);
        const rightNode = Parser.deserialize(serial.right);
        return new BinaryOperationNode(leftNode, rightNode, serial.operator);

      default:
        throw new Error('Unrecognized serialized node type');
    }
  }
}

