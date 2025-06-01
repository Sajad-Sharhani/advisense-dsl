// ----------------------------------------------------------------------------
// @copyright    (C) 2025 Sajad Sharhani
//
// @file         NumberNode.ts
// @author       Sajad Sharhani <sharhani.sajad@gmail.com>
// @brief        Defines AST node for numeric literals
// @details      Implements storage, evaluation, and printing of a numeric literal
// ----------------------------------------------------------------------------

import { ASTNode, SerializedASTNode } from "@/types";


export class NumberNode implements ASTNode {
  /**
   * @brief      Constructs a new NumberNode
   * @param      value   The numeric value of this literal
   * @details    Stores the provided numeric value for later evaluation and printing
   */
  constructor(public value: number) {}

  /**
   * @brief      Evaluates the numeric literal
   * @return     The numeric value stored in this node
   * @details    Simply returns the stored number
   */
  evaluate(): number {
    return this.value;
  }

  /**
   * @brief      Returns a string representation of the numeric literal
   * @return     The string form of the stored numeric value
   * @details    Converts the numeric value to its string equivalent
   */
  print(): string {
    return this.value.toString();
  }

  /**
   * @brief      Serializes this node into a structured object
   * @return     A SerializedASTNode representation of this NumberNode
   * @details    Converts the node into a format suitable for storage or transmission
   */
  serialize(): SerializedASTNode {
    return { type: 'NumberNode', value: this.value };
  }
}
