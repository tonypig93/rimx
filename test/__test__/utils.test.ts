import * as Immutable from 'immutable';
import { compareFn, normalizePath, isPlainObject, toCamelcase } from '../../src/base/utils';

describe('Utils', () => {
  test('compare function', () => {
    const a1 = [1, 1];
    const a2 = ['tony', 'tony'];
    const a3 = [undefined, undefined];
    const a4 = [null, null];
    const a5 = [1, '1'];
    const a6 = [undefined, null];
    const a7 = [{ text: 'hello' }, { text: 'hello' }];
    const a8 = [Immutable.Map({ text: 'hello' }), Immutable.Map({ text: 'hello' })];
    const a9 = [{ text: 'hello' }, Immutable.Map({ text: 'hello' })];
    const a10 = [NaN, NaN];

    expect(compareFn(a1[0], a1[1])).toBe(true);
    expect(compareFn(a2[0], a2[1])).toBe(true);
    expect(compareFn(a3[0], a3[1])).toBe(true);
    expect(compareFn(a4[0], a4[1])).toBe(true);
    expect(compareFn(a5[0], a5[1])).toBe(false);
    expect(compareFn(a6[0], a6[1])).toBe(false);
    expect(compareFn(a7[0], a7[1])).toBe(false);
    expect(compareFn(a8[0], a8[1])).toBe(true);
    expect(compareFn(a9[0], a9[1])).toBe(false);
    expect(compareFn(a10[0], a10[1])).toBe(true);
  })

  test('normalize path', () => {
    const dest = ['path', 'to', 'property'];
    expect(normalizePath(['path', 'to', 'property'])).toEqual(dest);
    expect(normalizePath('path.to.property')).toEqual(dest);
  })

  test('is plain object', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ text: 1 })).toBe(true);
    expect(isPlainObject(Immutable.Map())).toBe(false);
    expect(isPlainObject(new Date())).toBe(false);
  })

  test('to camel case', () => {
    expect(toCamelcase('a-b-c')).toBe('aBC');
    // expect(toCamelcase('a-11-c')).toBe('a11C');
  });
})
