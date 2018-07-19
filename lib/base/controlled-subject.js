/**
 * @class ControlledSubject
 */
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/takeUntil';
import { compareFn } from './utils';
export class ControlledSubject {
    constructor(path, scopeId, root) {
        this.unsubscribe$ = new Subject();
        this.dispatch = (action) => {
            const reducer = this.root.SCOPE[this.path].reducer;
            this.next(state => reducer(state, action));
        };
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
    subscribe(observer, key, mapper) {
        const root = this.root;
        // root.takeSnapshot();
        let observable = this.stateObservable;
        if (key) {
            observable = observable.map((d) => d.getIn(key)).distinctUntilChanged(compareFn);
        }
        else {
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
            const snapshot = root._getSnapshot(this.pluckPath); // eslint-disable-line
            nextState = input(snapshot);
        }
        else {
            nextState = input;
        }
        if (nextState instanceof Observable) {
            nextState.subscribe(_data => {
                root.updateState(this.path, _data);
            });
        }
        else {
            root.updateState(this.path, nextState);
        }
    }
    snapshot() {
        return this.root._getSnapshot(this.pluckPath); // eslint-disable-line
    }
    destroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
        this.closed = true;
        this.root = null;
        this.stateObservable = null;
    }
}
