import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/takeUntil';
import Immutable from 'immutable';

import ControlledSubject from './controlled-subject';

export class RxStoreFactory {
  constructor() {
    this.store = new BehaviorSubject(Immutable.Map());
    this.scopeId = 1;
    this.observers = Immutable.List([]);
  }
  
  /**
   * 注入新的scope
   * @param {string} [path='']
   * @param {object} initialState
   * @memberof RxStoreFactory
   */
  injectScope(path = '', initialState) {
    const wrappedState = this.initScope(initialState);
    this.updateScope(path, wrappedState);
  }
  /**
   * 更新scope
   * @param {string} path
   * @param {object} state
   * @memberof RxStoreFactory
   */
  updateScope(path, state) {
    let nextState;
    const subscription = this.store.subscribe({
      next: (rootState) => {
        nextState = this._processInject(path.split('.'), rootState, state); // eslint-disable-line
      },
      error: (err) => {
        throw new Error(err);
      },
    });
    subscription.unsubscribe();
    this.store.next(nextState);
  }
  /**
   * 生成当前store整体的快照，用于监视store状态。
   * 来回切换多个component发现subscription或者observers只增不减时，需要检查组件内是否释放了资源。
   */
  takeSnapshot() {
    const subscription = this.store.subscribe((d) => {
      console.group('RxStore snapshot');
      console.log('root state: ', d.toJS());
      console.log(`subscriptions(${this.observers.size}): `, this.observers.toJS());
      console.log(`subject observers(${this.store.observers.length}): `, this.store.observers);
      console.groupEnd();
    });
    subscription.unsubscribe();
  }
  /**
   * 删除scope
   * @param {string} path
   * @memberof RxStoreFactory
   */
  deleteScope(path) {
    let nextState;
    const subscription = this.store.subscribe({
      next: (rootState) => {
        nextState = rootState.deleteIn(path.split('.'));
      },
      error: (err) => {
        throw new Error(err);
      },
    });
    subscription.unsubscribe();
    this.store.next(nextState);
  }
  /**
   *
   * @param {string []} path
   * @param {object} rootState
   * @param {object} initialState
   */
  _processInject(path, rootState, initialState) {
    return rootState.mergeIn(path, initialState);
  }
  /**
   * 为scope初始化state
   * @param {object} [initialState={}]
   * @returns {object}
   * @memberof RxStoreFactory
   */
  initScope(initialState = {}) {
    const scopeId = this.scopeId++; // eslint-disable-line
    this.observers = this.observers.push({
      $scopeId: scopeId,
      observers: [],
    });
    return Object.assign(initialState, {
      $scopeId: scopeId,
    });
  }
  /**
   * 查找scope内的observer
   * @param {number} scopeId
   * @returns {object}
   * @memberof RxStoreFactory
   */
  findScopeObservers(scopeId) {
    return this.observers.find((ob) => {
      if (!ob) {
        throw new Error(`cannot find the observer list of scope ${this.scopeId}`);
      }
      return ob.$scopeId === scopeId;
    });
  }
  /**
   * 生成当前scope的快照
   * @param {string[]} pluckPath
   * @returns {object}
   * @memberof RxStoreFactory
   */
  _getSnapshot(pluckPath) {
    let snapshot;
    const subscription = this.store
      .map((rootState) => rootState.getIn(pluckPath))
      .subscribe((d) => {
        snapshot = d;
      });
    subscription.unsubscribe();
    return snapshot;
  }
  /**
   * 获取scope subject
   * @param {string} path
   * @returns {object}
   * @memberof RxStoreFactory
   */
  getStateSubject(path) {
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
}
