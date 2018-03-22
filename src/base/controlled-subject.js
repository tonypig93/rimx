/**
 * @class ControlledSubject
 */
import { compareFn } from './utils';

export default class ControlledSubject {
    constructor(path, scopeId, root) {
      this.path = path;
      this.pluckPath = path.split('.');
      this.root = root;
      this.scopeId = scopeId;
      this.streamControl = new Subject();
      this.closed = false;
      this.stateObservable = root.store
        .asObservable()
        .map((rootState) => rootState.getIn(this.pluckPath));
      // .finally(() => console.log('your watch is over'));
    }
    /**
     *
     *
     * @param {*} observer
     * @returns
     * @memberof ControlledSubject
     */
    subscribe(observer, key, mapper) {// eslint-disable-line
      const root = this.root;
      // root.takeSnapshot();
      let observable = this.stateObservable;
      if (key) {
        observable = observable.map((d) => d.getIn(key)).distinctUntilChanged(compareFn);
      } else {
        observable = observable.distinctUntilChanged(compareFn);
      }
      if (mapper) {
        observable = mapper(observable);
      }
      const subscription = observable.subscribe(observer);
      const observerScopeControl = root.findScopeObservers(this.scopeId);
      if (observerScopeControl) {
        observerScopeControl.observers.push(subscription);
        root.observers.set(root.observers.findIndex((ob) => {
          if (!ob) {
            throw new Error(`cannot find the observer list of scope ${this.scopeId}`);
          }
          return ob.$scopeId === this.scopeId;
        }), observerScopeControl);
      } else {
        throw new Error('Unknow error');
      }
      const unsubscribe = subscription.unsubscribe;
      subscription.unsubscribe = function _unsubscribe() {
        // const index = observerScopeControl.observers.findIndex((item) => item === subscription);
        // todo: delete item in array
        unsubscribe.call(subscription);
      };
      return subscription;
    }
    next(input) {
      if (this.closed) {
        return;
      }
      let newData;
      const root = this.root;
      if (typeof input === 'function') {
        const snapshot = root._getSnapshot(this.pluckPath);// eslint-disable-line
        newData = input(snapshot);
      } else {
        newData = input;
      }
      root.updateScope(this.path, newData);
    }
    snapshot() {
      return this.root._getSnapshot(this.pluckPath);// eslint-disable-line
    }
    destroy() {
      const root = this.root;
      const observerScopeControl = root.findScopeObservers(this.scopeId);
      this.closed = true;
  
      if (observerScopeControl) {
        observerScopeControl.observers.forEach((ob) => ob.unsubscribe());
      }
      root.deleteScope(this.path);
      const index = root.observers.findIndex((ob) => {
        if (!ob) {
          throw new Error(`cannot find the observer list of scope ${this.scopeId}`);
        }
        return ob.$scopeId === this.scopeId;
      });
      root.observers = root.observers.delete(index);
    }
  }
  