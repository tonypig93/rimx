import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import * as Immutable from 'immutable';

import { ControlledSubject } from './controlled-subject';
import { Reducer } from './types';

interface SCOPE {
  [path: string]: {
    reducer: Reducer;
  };
}

export class RxStoreFactory {
  store: BehaviorSubject<Immutable.Map<string, any>>;
  scopeId: number;
  SCOPE: SCOPE = {};
  constructor() {
    this.store = new BehaviorSubject(Immutable.Map());
    this.scopeId = 1;
  }
  
  /**
   * 注入新的scope
   * @param {string} scopeName
   * @param {object} initialState
   * @memberof RxStoreFactory
   */
  injectScope(scopeName = '', initialState, reducer: Reducer) {
    const wrappedState = this.createState(initialState);
    this.SCOPE[scopeName] = {
      reducer,
    };
    this.updateState(scopeName, wrappedState);
  }
  /**
   * 更新scope
   * @param {string} path
   * @param {object} state
   * @memberof RxStoreFactory
   */
  updateState(path: string, state) {
    const nextState = this._processInject(path.split('.'), this.store.value, state);
    this.store.next(nextState);
  }
  /**
   * 生成当前store整体的快照，用于监视store状态。
   * 来回切换多个component发现subscription或者observers只增不减时，需要检查组件内是否释放了资源。
   */
  takeSnapshot() {
    console.group('RxStore snapshot');
    console.log('root state: ', this.store.value.toJS());
    console.log(`subject observers(${this.store.observers.length}): `, this.store.observers);
    console.groupEnd();
  }
  /**
   * 删除scope
   * @param {string} path
   * @memberof RxStoreFactory
   */
  deleteScope(path: string) {
    const nextState = this.store.value.deleteIn(path.split('.'));
    this.store.next(nextState);
  }
  /**
   *
   * @param {string []} path
   * @param {object} rootState
   * @param {object} initialState
   */
  _processInject(path: string[], rootState, initialState) {
    return rootState.mergeDeepIn(path, initialState);
  }
  /**
   * 为scope初始化state
   * @param {object} [initialState={}]
   * @returns {object}
   * @memberof RxStoreFactory
   */
  createState(initialState = {}) {
    const scopeId = this.scopeId++; // eslint-disable-line
    return Object.assign(initialState, {
      $scopeId: scopeId,
    });
  }

  /**
   * 生成当前scope的快照
   * @param {string[]} pluckPath
   * @returns {object}
   * @memberof RxStoreFactory
   */
  _getSnapshot(pluckPath: string[]) {
    return this.store.value.getIn(pluckPath);
  }
  /**
   * 获取scope subject
   * @param {string} path
   * @returns {object}
   * @memberof RxStoreFactory
   */
  getStateSubject(path: string) {
    const pluckPath = path.split('.');
    const scopeId = this._getSnapshot(pluckPath).get('$scopeId');// eslint-disable-line
    if (!scopeId) {
      throw new Error('The state path you have required does not exist!');
    }
    return new ControlledSubject(path, scopeId, this);
  }
  /**
   * 销毁store
   * @memberof RxStoreFactory
   */
  destroy() {
    // TO DO: prevent memory leak
    this.store.complete();
  }

  destroyScope(scopeName) {
    this.deleteScope(scopeName);
  }
}
