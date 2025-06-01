export interface ASTNode {
  evaluate(): number | boolean;
  print(): string;
  serialize(): SerializedASTNode; 
}

export type SerializedASTNode =
  | { type: 'NumberNode'; value: number }
  | {
      type: 'BinaryOperationNode';
      operator: Operator;
      left: SerializedASTNode;
      right: SerializedASTNode;
    };

export type Operator = '+' | '-' | '*' | '/' | '<' | '>' | '=';
