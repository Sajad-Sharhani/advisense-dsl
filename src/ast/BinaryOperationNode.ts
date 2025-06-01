// ----------------------------------------------------------------------------
// @copyright    (C) 2025 Sajad Sharhani
//
// @file         BinaryOperationNode.ts
// @author       Sajad Sharhani <sharhani.sajad@gmail.com>
// @brief        Defines AST node for binary arithmetic and comparison operations
// @details      Implements evaluation and pretty-printing for binary operations
//               including +, -, *, /, <, >, and =
// ----------------------------------------------------------------------------

import { ASTNode, Operator, SerializedASTNode } from "@/types";


export class BinaryOperationNode implements ASTNode {
  /**
   * @brief   Constructs a new BinaryOperationNode
   * @param   left       Left-hand side ASTNode operand
   * @param   right      Right-hand side ASTNode operand
   * @param   operator   The operator to apply between left and right
   * @details Stores references to left and right operands along with the operator
   */
  constructor(
    public left: ASTNode,
    public right: ASTNode,
    public operator: Operator
  ) {}


  /**
   * @brief      Evaluates the binary operation
   * @return     The numeric or boolean result of applying the operator to left and right
   * @details    - For '+', '-', '*', '/': casts operands to numbers and returns arithmetic result
   *             - For '<', '>', '=': returns a boolean comparison
   */
  evaluate(): number | boolean {
    const leftVal = this.left.evaluate();
    const rightVal = this.right.evaluate();

    switch (this.operator) {
      case '+':
        return (leftVal as number) + (rightVal as number);
      case '-':
        return (leftVal as number) - (rightVal as number);
      case '*':
        return (leftVal as number) * (rightVal as number);
      case '/':
        if (rightVal === 0) {
          throw new Error('Division by zero');
        }
        return (leftVal as number) / (rightVal as number);
      case '<':
        return leftVal < rightVal 
      case '>':
        return leftVal > rightVal;
      case '=':
        return leftVal === rightVal
      default:
        throw new Error(`Unknown operator: ${this.operator}`);
    }
  }

  /**
   * @brief      Returns a string representation of the binary operation
   * @return     The expression in infix form with parentheses
   * @details    Recursively calls print() on left and right operands to build:
   *             "(<left> <operator> <right>)"
   */
  print(): string {
    return `(${this.left.print()} ${this.operator} ${this.right.print()})`;
  }

  /**
   * @brief      Serializes this node into a structured object
   * @return     A SerializedASTNode representation of this BinaryOperationNode
   * @details    Converts the node into a format suitable for storage or transmission
   */
  serialize(): SerializedASTNode {
    return {
      type: 'BinaryOperationNode',
      operator: this.operator,
      left: this.left.serialize(),
      right: this.right.serialize(),
    };
  }
}

