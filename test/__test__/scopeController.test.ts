import * as Immutable from 'immutable';
import { Observable } from 'rxjs';
import * as isObservable from 'is-observable';
import { RxStoreFactory } from '../../src/base/factory';
import { combineReducers } from '../../src/base/combineReducers';

let store: RxStoreFactory;
const scopeName = 'test';
function reducer1(state, action) {
  return {
    text: 'world'
  };
};
function reducer2(state, action) {
  return Observable
    .of({ text: 'world!' })
    .delay(100);
}
const reducer = combineReducers({
  test: reducer1,
  async: reducer2,
});

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

  test('create a scope controller with a wrong name', () => {
    expect(() => store.getScopeController('not exist')).toThrow();
  })

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

    controller.dispatch({ type: 'test' });

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

  test('subscribe with force=false', done => {
    const fn = jest.fn();
    const controller = store.getScopeController(scopeName);
    controller.subscribe(fn, ['text'], false, ob => ob.finally(() => {
      expect(fn.mock.calls.length).toBe(1);
      done();
    }));

    controller.next(() => ({ text: 'hello' }));
    setTimeout(() => {
      controller.destroy();
    }, 100);
  })

  test('subscribe with force=ture', done => {
    const fn = jest.fn();
    const controller = store.getScopeController(scopeName);
    controller.subscribe(fn, ['text'], true, ob => ob.finally(() => {
      expect(fn.mock.calls.length).toBe(2);
      done();
    }));

    controller.next(() => ({ text: 'hello' }));
    setTimeout(() => {
      controller.destroy();
    }, 100);
  })

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

  test('change state with an async reducer', done => {
    const controller = store.getScopeController(scopeName);

    controller.dispatch({ type: 'async' });

    const observer = jest
      .fn()
      .mockImplementationOnce(name => {
        expect(name).toBe('hello');
      })
      .mockImplementationOnce(name => {
        expect(name).toBe('world!');
        done();
      })
    // expect(store.store.value.getIn([scopeName, 'state', 'text'])).toBe('world');
    controller.subscribe(observer, ['text']);

  })

});
