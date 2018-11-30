import * as Immutable from 'immutable';
import { RxStoreFactory } from '../../src/base/factory';
import { ScopeController } from '../../src/base/scopeController';
import { combineReducers } from '../../src/base/combineReducers';

let store: RxStoreFactory;
let controller: ScopeController;
const scopeName = 'test';

function reducer1(state, action) {
  return {
    name: 'tom',
  };
};

function reducer2(state, action) {
  return Immutable.Map({
    name: 'tom',
  });
}

function reducer3(state, action) {
  return {
    hobbies: ['watch TV', 'eat food'],
  };
}

function reducer4(state, action) {
  return {
    info: {
      position: 'CEO',
      salary: 100,
    }
  };
}

function reducer5(state, action) {
  return Immutable.Map({
    info: {
      position: 'CEO',
      salary: 100,
    }
  })
}


const reducer = combineReducers({
  1: reducer1,
  2: reducer2,
  3: reducer3,
  4: reducer4,
  5: reducer5,
});

beforeEach(() => {
  store = new RxStoreFactory();
  store.injectScope(scopeName, {
    name: 'tony',
    age: 18,
    hobbies: ['sports', 'video games'],
    info: {
      id: 88,
      position: 'developer',
    },
  }, reducer);
  controller = store.getScopeController(scopeName);
});

describe('Reducer: merge', () => {
  test('merge state: shallow merge', () => {
    controller.dispatch({ type: '1' });

    expect(store.store.value.getIn([scopeName]).toJS()).toEqual({
      state: {
        name: 'tom',
        age: 18,
        hobbies: ['sports', 'video games'],
        info: {
          id: 88,
          position: 'developer',
        },
      },
      __scopeId: 1,
      __cached: false,
      __log: false,
      __reducer: reducer
    });
  });

  test('merge state: shallow merge by returning a Immutable', () => {
    controller.dispatch({ type: '2' });

    expect(store.store.value.getIn([scopeName]).toJS()).toEqual({
      state: {
        name: 'tom',
        age: 18,
        hobbies: ['sports', 'video games'],
        info: {
          id: 88,
          position: 'developer',
        },
      },
      __scopeId: 1,
      __cached: false,
      __log: false,
      __reducer: reducer
    });
  })

  // 合并数组时，同一位置上的会被替换。
  test('merge state: merge arrays', () => {
    controller.dispatch({ type: '3' });

    expect(store.store.value.getIn([scopeName]).toJS()).toEqual({
      state: {
        name: 'tony',
        age: 18,
        hobbies: ['watch TV', 'eat food'],
        info: {
          id: 88,
          position: 'developer',
        },
      },
      __scopeId: 1,
      __cached: false,
      __log: false,
      __reducer: reducer
    });
    expect(store.store.value.getIn([scopeName, 'state', 'hobbies'])).toBeInstanceOf(Immutable.List);
  })

  test('merge state: deep merge', () => {
    controller.dispatch({ type: '4' });

    expect(store.store.value.getIn([scopeName]).toJS()).toEqual({
      state: {
        name: 'tony',
        age: 18,
        hobbies: ['sports', 'video games'],
        info: {
          position: 'CEO',
          salary: 100
        },
      },
      __scopeId: 1,
      __cached: false,
      __log: false,
      __reducer: reducer
    });

    expect(store.store.value.getIn([scopeName, 'state', 'info'])).toBeInstanceOf(Immutable.Map);
  })

  test('merge state: deep merge with a plain object', () => {
    controller.dispatch({ type: '5' });

    expect(store.store.value.getIn([scopeName]).toJS()).toEqual({
      state: {
        name: 'tony',
        age: 18,
        hobbies: ['sports', 'video games'],
        info: {
          position: 'CEO',
          salary: 100
        },
      },
      __scopeId: 1,
      __cached: false,
      __log: false,
      __reducer: reducer
    });

    expect(store.store.value.getIn([scopeName, 'state', 'info'])).toBeInstanceOf(Object);
  })

});

describe('Reducer: update', () => {
  test('merge state: shallow merge', () => {
    controller.dispatch({ type: '1' }, false);

    expect(store.store.value.getIn([scopeName]).toJS()).toEqual({
      state: {
        name: 'tom',
      },
      __scopeId: 1,
      __cached: false,
      __log: false,
      __reducer: reducer
    });
  });

  test('merge state: shallow merge by returning a Immutable', () => {
    controller.dispatch({ type: '2' }, false);

    expect(store.store.value.getIn([scopeName]).toJS()).toEqual({
      state: {
        name: 'tom',
      },
      __scopeId: 1,
      __cached: false,
      __log: false,
      __reducer: reducer
    });
  })

  // 合并数组时，同一位置上的会被替换。
  test('merge state: merge arrays', () => {
    controller.dispatch({ type: '3' }, false);

    expect(store.store.value.getIn([scopeName]).toJS()).toEqual({
      state: {
        hobbies: ['watch TV', 'eat food'],
      },
      __scopeId: 1,
      __cached: false,
      __log: false,
      __reducer: reducer
    });
    expect(store.store.value.getIn([scopeName, 'state', 'hobbies'])).toBeInstanceOf(Immutable.List);
  })

  test('merge state: deep merge', () => {
    controller.dispatch({ type: '4' }, false);

    expect(store.store.value.getIn([scopeName]).toJS()).toEqual({
      state: {
        info: {
          position: 'CEO',
          salary: 100
        },
      },
      __scopeId: 1,
      __cached: false,
      __log: false,
      __reducer: reducer
    });

    expect(store.store.value.getIn([scopeName, 'state', 'info'])).toBeInstanceOf(Immutable.Map);
  })

  test('merge state: deep merge with a plain object', () => {
    controller.dispatch({ type: '5' }, false);

    expect(store.store.value.getIn([scopeName]).toJS()).toEqual({
      state: {
        info: {
          position: 'CEO',
          salary: 100
        },
      },
      __scopeId: 1,
      __cached: false,
      __log: false,
      __reducer: reducer
    });

    expect(store.store.value.getIn([scopeName, 'state', 'info'])).toBeInstanceOf(Object);
  })

});
