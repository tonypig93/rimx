/**
 * @class ControlledSubject
 */
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import { compareFn } from './utils';
import { Reducer, Action } from './types';

export class ControlledSubject {
  path: string;
  pluckPath: string[];
  root: any;
  scopeId: number;
  closed: boolean;
  unsubscribe$ = new Subject();
  stateObservable: Observable<any>;
    constructor(path: string, scopeId: number, root) {
      this.path = path;
      this.pluckPath = path.split('.');
      this.root = root;
      this.scopeId = scopeId;
      this.closed = false;
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
    next(input) {
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
      if (nextState instanceof Observable) {
        nextState.subscribe(_data => {
          root.updateState(this.path, _data);
        });
      } else {
        root.updateState(this.path, nextState);
      }
    }
  
    dispatch = (action: Action) => {
      const reducer = this.root.SCOPE[this.path].reducer;
      this.next(state => reducer(state, action));
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
  