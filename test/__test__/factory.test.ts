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

    store.deleteScope(scopeName);

    expect(store.store.value.get(scopeName)).toBeUndefined();
  });
});
