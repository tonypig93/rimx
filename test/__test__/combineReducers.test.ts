import { combineReducers as combine } from '../../src/base/combineReducers';

const scopeName = 'test';
const combineReducers: any = combine; // hack for test

function reducer1(state, action) {
  return {
    text: 'world'
  };
};

function reducer2(state, action) {
  return {
    name: 'tom',
  };
}

describe('combine reducers', () => {
  test('returns a composite reducer that maps the state keys to given reducers', () => {
    const reducer = combineReducers({
      foo: reducer1,
      bar: reducer2,
    });

    expect(typeof reducer === 'function').toBe(true);

    const state = {
      text: 'hello',
      name: 'tony',
    };

    expect(reducer(state, { type: 'foo' })).toEqual({
      text: 'world',
    });

    expect(reducer(state, { type: 'bar' })).toEqual({
      name: 'tom',
    });

  });

  test('ignores all props which are not a function', () => {
    const reducer = combineReducers({
      foo: reducer1,
      bar: reducer2,
      fake: true,
      broken: 'string',
    });

    const state = {
      text: 'hello',
      name: 'tony',
    };

    expect(() => reducer(state, { type: 'fake' })).toThrow();
  })
})
