import { describe, it, expect } from 'vitest';
import { NumberNode } from '../src/ast/NumberNode';
import { Parser } from '../src/parser/Parser';

describe('NumberNode', () => {
  it('evaluate() returns the numeric value', () => {
    const n = new NumberNode(42);
    expect(n.evaluate()).toBe(42);
  });

  it('print() returns the value as string', () => {
    const n = new NumberNode(3.14);
    expect(n.print()).toBe('3.14');
  });

  it('serialize() returns correct JSON shape', () => {
    const n = new NumberNode(7);
    expect(n.serialize()).toEqual({ type: 'NumberNode', value: 7 });
  });

  it('deserialize(NumberNode JSON) reconstructs identical node', () => {
    // We use Parser.deserialize even for leaf nodes
    const serialized = { type: 'NumberNode', value: 13 };
    const node = Parser.deserialize(serialized);
    expect(node.evaluate()).toBe(13);
    expect(node.print()).toBe('13');
    expect(node.serialize()).toEqual(serialized);
  });
});

