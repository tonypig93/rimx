import * as Immutable from 'immutable';
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

describe('ScopeController', () => {
  test('create a scope controller', done => {
    const controller = store.getScopeController(scopeName);

    controller.stateObservable.subscribe(data => {
      expect(data.toJS()).toEqual({
        text: 'hello'
      });
      done();
    });
  });

  test('change the state directly by an object', () => {
    const controller = store.getScopeController(scopeName);

    controller.next({ text: 'world' });

    expect(store.store.value.getIn([scopeName, 'state', 'text'])).toBe('world');
  });

  test('change the state directly by a function', () => {
    const controller = store.getScopeController(scopeName);

    controller.next(() => {
      return {
        text: 'world'
      };
    });

    expect(store.store.value.getIn([scopeName, 'state'])).toBeInstanceOf(Immutable.Map);
    expect(store.store.value.getIn([scopeName, 'state', 'text'])).toBe('world');

    controller.next(() => {
      return Immutable.Map({
        text: '!',
      });
    });

    expect(store.store.value.getIn([scopeName, 'state'])).toBeInstanceOf(Immutable.Map);
    expect(store.store.value.getIn([scopeName, 'state', 'text'])).toBe('!');
  });

  test('change the state by the reducer', () => {
    const controller = store.getScopeController(scopeName);

    controller.dispatch(null);

    expect(store.store.value.getIn([scopeName, 'state', 'text'])).toBe('world');
  });

  test('get the scope state', () => {
    const controller = store.getScopeController(scopeName);

    const scopeState = controller.getScopeState();

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

  test('get the state snapshot', () => {
    const controller = store.getScopeController(scopeName);

    const scopeState = controller.snapshot();

    expect(scopeState.toJS()).toEqual({
      text: 'hello'
    });
  });

  test('subscribe', done => {
    const controller = store.getScopeController(scopeName);
    controller.subscribe(
      data => {
        expect(data).toBe('hello');
        done();
      },
      ['text']
    );
  });

  test('subscription listeners in store', () => {
    const controller = store.getScopeController(scopeName);
    controller.subscribe(data => {}, ['text']);

    expect(store.store.observers.length).toBe(1);
  });

  test('destroy a scope controller', () => {
    const controller = store.getScopeController(scopeName);
    controller.subscribe(data => {}, ['text']);
    controller.subscribe(data => {}, ['text']);

    expect(store.store.observers.length).toBe(2);
    controller.destroy();
    expect(store.store.observers.length).toBe(0);
  });


});
