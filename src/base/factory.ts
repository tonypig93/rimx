import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as Immutable from 'immutable';

import { ScopeController } from './scope-controller';
import { Reducer, ScopeState } from './types';
import { normalizePath } from './utils';

export class RxStoreFactory {
  store: BehaviorSubject<Immutable.Map<string, any>>;
  scopeId: number;
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
  injectScope(
    scopeName: string,
    initialState,
    reducer: Reducer,
    cacheState = false,
    log = false
  ) {
    if (!scopeName) {
      throw new Error('You should provide a scope name to create a scope');
    }
    const prevScopeState = this._getSnapshot(scopeName);
    if (prevScopeState && prevScopeState.get('__cached')) return;

    const wrappedState = this.createState(
      initialState,
      reducer,
      cacheState,
      log
    );

    // this.updateState(scopeName, wrappedState);
    const nextState = this.store.value.set(
      scopeName,
      Immutable.fromJS(wrappedState)
    );
    this.store.next(nextState);
  }
  /**
   * 更新scope
   * @param {string} path
   * @param {object} state
   * @memberof RxStoreFactory
   */
  updateState = (path: string, state, merge) => {
    const nextState = this._processInject(
      path.split('.'),
      this.store.value,
      state,
      merge
    );
    this.store.next(nextState);
  };
  /**
   * 生成当前store整体的快照，用于监视store状态。
   * 来回切换多个component发现subscription或者observers只增不减时，需要检查组件内是否释放了资源。
   */
  takeSnapshot() {
    console.group('RxStore snapshot');
    console.log('root state: ', this.store.value.toJS());
    console.log(
      `subject observers(${this.store.observers.length}): `,
      this.store.observers
    );
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
  private _processInject(path: string[], rootState, initialState, merge) {
    return merge
      ? rootState.mergeDeepIn(path, initialState)
      : rootState.updateIn(path, () => initialState);
  }
  /**
   * 为scope初始化state
   * @param {object} [initialState={}]
   * @returns {object}
   * @memberof RxStoreFactory
   */
  createState(
    initialState = {},
    reducer,
    cacheState: boolean,
    log: boolean
  ): ScopeState {
    const scopeId = this.scopeId++; // eslint-disable-line
    return Object.assign(initialState, {
      __scopeId: scopeId,
      __reducer: reducer,
      __cached: cacheState,
      __log: log
    });
  }

  /**
   * 生成当前scope的快照
   * @param {string[]} pluckPath
   * @returns {object}
   * @memberof RxStoreFactory
   */
  private _getSnapshot(path: string | string[]) {
    return this.store.value.getIn(normalizePath(path));
  }
  /**
   * 获取scope subject
   * @param {string} path
   * @returns {object}
   * @memberof RxStoreFactory
   */
  getScope(scopeName: string) {
    const state = this._getSnapshot(scopeName);
    const scopeId = state.get('__scopeId'); // eslint-disable-line
    const log = state.get('__log');
    if (!scopeId) {
      throw new Error('The state path you have required does not exist!');
    }
    return new ScopeController(scopeName, this.store, this.updateState);
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
