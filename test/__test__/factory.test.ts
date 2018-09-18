import { RxStoreFactory } from '../../src/base/factory';

let store: RxStoreFactory;
const scopeName = 'test';
const reducer = function reducer(state, action) {
  return {
    text: 'world'
  };
};

beforeEach(() => {
  store = new RxStoreFactory();
  store.injectScope(scopeName, { text: 'hello' }, reducer);
});

describe('RxStoreFactory', () => {
  test('exposes the public API', () => {
    const methods = Object.keys(store);

    expect(methods).toContain('injectScope');
    expect(methods).toContain('updateState');
    expect(methods).toContain('takeSnapshot');
    expect(methods).toContain('getScopeController');
  });

  test('create a scope in store', () => {
    const scopeState = store.store.value.get(scopeName);

    expect(scopeState.toJS()).toEqual({
      state: {
        text: 'hello'
      },
      __scopeId: 1,
      __cached: false,
      __log: false,
      __reducer: reducer
    });
  });

  test('not provide a scope name', () => {
    expect(() => store.injectScope(undefined, { text: 'hello' })).toThrow();
  })

  test('not provide an initial state', () => {
    const key = 'no initial state';
    store.injectScope(key, undefined);
    const scopeState = store.store.value.get(key);
    expect(scopeState.toJS()).toEqual({
      state: {

      },
      __scopeId: 2,
      __cached: false,
      __log: false,
    });
  })

  test('delete a scope', () => {
    expect(store.store.value.get(scopeName).toJS()).toEqual({
      state: {
        text: 'hello'
      },
      __scopeId: 1,
      __cached: false,
      __log: false,
      __reducer: reducer
    });

    store.destroyScope(scopeName);

    expect(store.store.value.get(scopeName)).toBeUndefined();
  });

  test('take a snapshot', () => {
    const snapshot = store.takeSnapshot();
    expect(snapshot).toEqual({
      store: {
        test: {
          state: {
            text: 'hello'
          },
          __scopeId: 1,
          __cached: false,
          __log: false,
          __reducer: reducer
        }
      },
      observers: [],
    })
  });

  test('recreate a scope', () => {
    store.injectScope(scopeName, { text: 'world', name: 'tony' }, reducer);
    expect(store.store.value.get(scopeName).toJS()).toEqual({
      state: {
        text: 'world',
        name: 'tony'
      },
      __scopeId: 2,
      __cached: false,
      __log: false,
      __reducer: reducer
    })
  });

  test('cache a scope', () => {
    store.injectScope('to be cached', { text: 'hello' }, reducer, true);
    store.injectScope('to be cached', {}, reducer, true);

    expect(store.store.value.get(scopeName).toJS()).toEqual({
      state: {
        text: 'hello',
      },
      __scopeId: 1,
      __cached: false,
      __log: false,
      __reducer: reducer
    })
  });
});
