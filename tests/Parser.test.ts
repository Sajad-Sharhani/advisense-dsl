import { describe, it, expect } from 'vitest';
import { Parser } from '../src/parser/Parser';

describe('Parser.parse + evaluate + print', () => {
  it.each<[string, number | boolean, string]>([
    ['10 + 5',                 15,    '(10 + 5)'],
    ['(1 + 2) * 3',            9,     '((1 + 2) * 3)'],
    ['3 + 4 * 2 / (1 - 5) + 7', 8,     '((3 + ((4 * 2) / (1 - 5))) + 7)'],
    ['(2 + 3) < (4 - 1)',      false, '((2 + 3) < (4 - 1))'],
  ])('parses "%s"', (expr, expectedVal, expectedPrint) => {
    const ast = Parser.parse(expr);
    expect(ast.evaluate()).toBe(expectedVal);
    // normalize whitespace on both sides
    expect(ast.print().replace(/\s+/g, '')).toBe(
      expectedPrint.replace(/\s+/g, '')
    );
  });

  it('throws on mismatched parentheses', () => {
    expect(() => Parser.parse('(1 + 2')).toThrow('Invalid or mismatched parentheses');
  });

  it('throws on unexpected characters', () => {
    expect(() => Parser.parse('1 + $')).toThrow(/Unexpected token/);
  });
});

describe('Parser edge cases', () => {
  it('throws on empty input', () => {
    expect(() => Parser.parse('')).toThrow();
  });

  it('throws on whitespace-only input', () => {
    expect(() => Parser.parse('   ')).toThrow();
  });

  it('parses trailing decimal', () => {
    expect(Parser.parse('123.').evaluate()).toBe(123);
  });

  it('parses leading decimal', () => {
    expect(Parser.parse('.5 + .5').evaluate()).toBe(1);
  });

  it('parses malformed decimal as prefix number', () => {
    // parseFloat stops at second '.', so we get 1.2
    expect(Parser.parse('1.2.3').evaluate()).toBe(1.2);
  });

  it('throws on consecutive operators during evaluate', () => {
    expect(() => Parser.parse('1 + * 2').evaluate()).toThrow();
  });

  it('throws on trailing operator during evaluate', () => {
    expect(() => Parser.parse('1 +').evaluate()).toThrow();
  });

  it('throws on leading operator during evaluate', () => {
    expect(() => Parser.parse('*3').evaluate()).toThrow();
  });

  it('binds + before < (current precedence)', () => {
    // parser treats '<' and '+' at same/higher precedence, so (1<2)+3 => 1 + 3 = 4
    const ast = Parser.parse('1 < (2 + 3)');
    expect(ast.evaluate()).toBe(true);
  });

  it('throws on empty parentheses', () => {
    expect(() => Parser.parse('()')).toThrow();
  });

  it('throws on whitespace-only parentheses', () => {
    expect(() => Parser.parse('(   )')).toThrow();
  });
});

describe('Serialization / Deserialization', () => {
  it('round-trips a simple NumberNode via serialize/deserialize', () => {
    const expr = '42';
    const ast = Parser.parse(expr);
    const serialized = ast.serialize();
    // Should be { type: 'NumberNode', value: 42 }
    expect(serialized).toEqual({ type: 'NumberNode', value: 42 });
    const rebuilt = Parser.deserialize(serialized);
    expect(rebuilt.evaluate()).toBe(42);
    expect(rebuilt.print()).toBe('42');
  });

  it('round-trips a BinaryOperationNode via serialize/deserialize', () => {
    const expr = '(1 + 2) * (3 - 4) / 2';
    const ast = Parser.parse(expr);
    const originalEval = ast.evaluate();
    const originalPrint = ast.print().replace(/\s+/g, '');
    
    const serialized = ast.serialize();
    // Rebuild from the serialized shape
    const rebuilt = Parser.deserialize(serialized);

    expect(rebuilt.evaluate()).toBe(originalEval);
    expect(rebuilt.print().replace(/\s+/g, '')).toBe(originalPrint);
    // And serializing the rebuilt should yield the same object
    expect(rebuilt.serialize()).toEqual(serialized);
  });
});

