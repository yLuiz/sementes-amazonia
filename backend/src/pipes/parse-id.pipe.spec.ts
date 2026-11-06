import { BadRequestException } from '@nestjs/common';
import { ParseIdPipe } from './parse-id.pipe';

describe('ParseIdPipe', () => {
  const pipe = new ParseIdPipe();

  it.each([
    [1, 1],
    ['42', 42],
    [2147483647, 2147483647],
  ])('aceita %p', (value, expected) => {
    expect(pipe.transform(value)).toBe(expected);
  });

  // NaN é o que chega de `abc` depois do ValidationPipe global.
  it.each([
    NaN,
    'abc',
    '1.5',
    1.5,
    0,
    -1,
    '-1',
    2147483648,
    '99999999999',
    Infinity,
    '',
    null,
    undefined,
  ])('recusa %p', (value) => {
    expect(() => pipe.transform(value)).toThrow(BadRequestException);
  });
});
