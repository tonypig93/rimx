/**
 * @class ScopeController
 */
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/takeUntil';
import * as Immutable from 'immutable';
import { compareFn } from './utils';
import { Reducer, Action } from './types';

export class ScopeController {
  private closed: boolean = false;
  private stateChangeCounter = 0;
  private unsubscribe$ = new Subject();
  stateObservable: Observable<any>;
  constructor(
    public scopeName: string,
    private store: BehaviorSubject<Immutable.Map<string, any>>,
    private updateStore: (
      scopeName: string,
      nextState: Object,
      merge: boolean
    ) => void
  ) {
    this.stateObservable = store
      .asObservable()
      .map(rootState => rootState.getIn([scopeName, 'state']));
  }

  getScopeState(): Immutable.Map<string, any> {
    return this.store.value.get(this.scopeName);
  }
  /**
   *
   *
   * @param {*} observer
   * @returns
   * @memberof ControlledSubject
   */
  subscribe(
    observer,
    key: string[],
    mapper?: (ob: Observable<any>) => Observable<any>
  ) {
    // root.takeSnapshot();
    let observable = this.stateObservable;
    if (key) {
      observable = observable
        .map(d => d.getIn(key))
        .distinctUntilChanged(compareFn);
    } else {
      observable = observable.distinctUntilChanged(compareFn);
    }
    if (mapper) {
      observable = mapper(observable);
    }
    const subscription = observable
      .takeUntil(this.unsubscribe$)
      .subscribe(observer);
    return subscription;
  }

  private _updater(nextState, merge, log) {
    this.updateStore(this.scopeName, nextState, merge);
    if (log) {
      console.log(`[${this.stateChangeCounter}] After change`);
      console.log(nextState);
    }
    this.stateChangeCounter++;
  }

  next(input, merge = true, action?: Action) {
    if (this.closed) {
      return;
    }
    const prevScopeState = this.getScopeState();
    const showLog = prevScopeState.get('__log');
    let nextScopeState, nextState;

    if (typeof input === 'function') {
      nextState = input(prevScopeState.get('state'))
    } else {
      nextState = input;
    }

    nextScopeState = prevScopeState.set('state', Immutable.fromJS(nextState));

    if (showLog) {
      console.log(`[${this.stateChangeCounter}] Before change`);
      if (action) {
        console.log(`[${this.stateChangeCounter}] Action`);
        console.log(action);
      }
      console.log(prevScopeState);
    }
    if (nextScopeState.get('state') instanceof Observable) {
      nextScopeState.get('state').subscribe(_data => {
        this._updater(nextScopeState.set('state', _data), merge, showLog);
      });
    } else {
      this._updater(nextScopeState, merge, showLog);
    }
  }

  dispatch = (action: Action, merge?: boolean) => {
    const scopeState = this.getScopeState();
    const reducer = scopeState.get('__reducer');

    this.next(state => reducer(state, action), merge, action);
  };

  snapshot() {
    return this.getScopeState().get('state');
  }

  destroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    this.closed = true;
    this.store = null;
    this.stateObservable = null;
  }
}
