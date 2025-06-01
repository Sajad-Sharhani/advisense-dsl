import { describe, it, expect } from 'vitest';
import { NumberNode } from '../src/ast/NumberNode';
import { BinaryOperationNode } from '../src/ast/BinaryOperationNode';
import { Operator } from '../src/types';
import { Parser } from '../src/parser/Parser';

describe('BinaryOperationNode – arithmetic', () => {
  const a = new NumberNode(10);
  const b = new NumberNode(5);

  it.each< [Operator, number]>([
    ['+', 15],
    ['-', 5],
    ['*', 50],
    ['/', 2],
  ])('correctly computes %s', (op, expected) => {
    const node = new BinaryOperationNode(a, b, op);
    expect(node.evaluate()).toBe(expected);
    expect(node.print()).toBe(`(10 ${op} 5)`);
  });

  it('division by zero throws', () => {
    const zero = new NumberNode(0);
    const node = new BinaryOperationNode(a, zero, '/');
    expect(() => node.evaluate()).toThrow('Division by zero');
  });

    it('serialize() returns correct JSON for a simple operation', () => {
    const node = new BinaryOperationNode(a, b, '+');
    expect(node.serialize()).toEqual({
      type: 'BinaryOperationNode',
      operator: '+',
      left: { type: 'NumberNode', value: 10 },
      right: { type: 'NumberNode', value: 5 },
    });
  });

  it('deserialize(BinaryOperationNode JSON) reconstructs identical subtree', () => {
    const serialized = {
      type: 'BinaryOperationNode',
      operator: '*',
      left: { type: 'NumberNode', value: 2 },
      right: {
        type: 'BinaryOperationNode',
        operator: '-',
        left: { type: 'NumberNode', value: 8 },
        right: { type: 'NumberNode', value: 3 },
      },
    };
    const node = Parser.deserialize(serialized);
    // Evaluate: 2 * (8 - 3) = 10
    expect(node.evaluate()).toBe(10);
    expect(node.print().replace(/\s+/g, '')).toBe('(2*(8-3))');
    expect(node.serialize()).toEqual(serialized);
  });
});

describe('BinaryOperationNode – comparisons', () => {
  const x = new NumberNode(2);
  const y = new NumberNode(3);

  it.each< [Operator, boolean]>([
    ['<', true],
    ['>', false],
    ['=', false],
  ])('correctly computes %s', (op, expected) => {
    const node = new BinaryOperationNode(x, y, op);
    expect(node.evaluate()).toBe(expected);
    expect(node.print()).toBe(`(2 ${op} 3)`);
  });
});

