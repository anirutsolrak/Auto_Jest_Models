const { soma } = require('../src/calculadora');

test('Soma dois números corretamente', () => {
  expect(soma(1, 2)).toBe(3);
});