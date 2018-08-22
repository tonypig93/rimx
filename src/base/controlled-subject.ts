/**
 * @class ControlledSubject
 */
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/takeUntil';
import { compareFn } from './utils';
import { Reducer, Action } from './types';

export class ControlledSubject {
  path: string;
  pluckPath: string[];
  root: any;
  scopeId: number;
  closed: boolean;
  unsubscribe$ = new Subject();
  log: boolean;
  stateObservable: Observable<any>;
    constructor(path: string, scopeId: number, log, root) {
      this.path = path;
      this.pluckPath = path.split('.');
      this.root = root;
      this.scopeId = scopeId;
      this.closed = false;
      this.log = log;
      this.stateObservable = root.store
        .asObservable()
        .map((rootState) => rootState.getIn(this.pluckPath));
    }
    /**
     *
     *
     * @param {*} observer
     * @returns
     * @memberof ControlledSubject
     */
    subscribe(observer, key: string[], mapper: (ob: Observable<any>) => Observable<any>) {// eslint-disable-line
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
      const subscription = observable.takeUntil(this.unsubscribe$).subscribe(observer);
      return subscription;
    }
    next(input, merge = true) {
      if (this.closed) {
        return;
      }
      let nextState;
      const root = this.root;
      if (typeof input === 'function') {
        const snapshot = root._getSnapshot(this.pluckPath);// eslint-disable-line
        nextState = input(snapshot);
      } else {
        nextState = input;
      }

      if (this.log) {
        console.log('before change', root._getSnapshot(this.pluckPath));
      }

      function updater(next) {
        root.updateState(this.path, next, merge);
        if (this.log) {
          console.log('after change', root._getSnapshot(this.pluckPath));
        }
      }

      if (nextState instanceof Observable) {
        nextState.subscribe(_data => {
          updater(_data);
        });
      } else {
        updater(nextState)
      }
    }
  
    dispatch = (action: Action, merge) => {
      const reducer = this.root.SCOPE[this.path].reducer;
      if (this.log) {
        console.log('action:', action);
      }
      this.next(state => reducer(state, action), merge);
    }
  
    snapshot() {
      return this.root._getSnapshot(this.pluckPath);// eslint-disable-line
    }
    destroy() {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
      
      this.closed = true;
      this.root = null;
      this.stateObservable = null;
    }
  }
  