(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('immutable'), require('rxjs/Observable'), require('rxjs/Subject'), require('rxjs/add/operator/map'), require('rxjs/add/operator/distinctUntilChanged'), require('rxjs/add/operator/takeUntil'), require('rxjs/BehaviorSubject'), require('react')) :
    typeof define === 'function' && define.amd ? define(['exports', 'immutable', 'rxjs/Observable', 'rxjs/Subject', 'rxjs/add/operator/map', 'rxjs/add/operator/distinctUntilChanged', 'rxjs/add/operator/takeUntil', 'rxjs/BehaviorSubject', 'react'], factory) :
    (factory((global.rimx = {}),global.Immutable,global.Observable,global.Subject,null,null,null,global.BehaviorSubject,global.React));
}(this, (function (exports,Immutable,Observable,Subject,map,distinctUntilChanged,takeUntil,BehaviorSubject,React) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function isNativeType(variable) {
        return (typeof variable === 'string' ||
            typeof variable === 'number' ||
            typeof variable === 'undefined' ||
            variable === null);
    }
    function compareFn(a, b) {
        if (isNativeType(a) && isNativeType(b)) {
            return Object.is(a, b);
        }
        return Immutable.is(a, b);
    }
    function normalizePath(path) {
        if (Array.isArray(path)) {
            return path;
        }
        if (typeof path === 'string') {
            return path.split('.');
        }
        throw new Error('invalid path type');
    }
    function isPlainObject(value) {
        return (value && (value.constructor === Object || value.constructor === undefined));
    }
    function toCamelcase(value) {
        return value.replace(/-([a-z])/gi, function (all, letter) { return letter.toUpperCase(); });
    }

    var ScopeController = /** @class */ (function () {
        function ScopeController(scopeName, store, updateStore) {
            var _this = this;
            this.scopeName = scopeName;
            this.store = store;
            this.updateStore = updateStore;
            this.closed = false;
            this.stateChangeCounter = 0;
            this.unsubscribe$ = new Subject.Subject();
            this.dispatch = function (action, merge) {
                var scopeState = _this.getScopeState();
                var reducer = scopeState.get('__reducer');
                _this.next(function (state) { return reducer(state, action); }, merge, action);
            };
            this.stateObservable = store
                .asObservable()
                .map(function (rootState) { return rootState.getIn([scopeName, 'state']); });
        }
        ScopeController.prototype.getScopeState = function () {
            return this.store.value.get(this.scopeName);
        };
        /**
         *
         *
         * @param {*} observer
         * @returns
         * @memberof ControlledSubject
         */
        ScopeController.prototype.subscribe = function (observer, key, force, mapper) {
            if (force === void 0) { force = false; }
            // root.takeSnapshot();
            var observable = this.stateObservable;
            if (key) {
                observable = observable
                    .map(function (d) { return d.getIn(key); });
            }
            if (!force) {
                observable = observable.distinctUntilChanged(compareFn);
            }
            if (mapper) {
                observable = mapper(observable);
            }
            var subscription = observable
                .takeUntil(this.unsubscribe$)
                .subscribe(observer);
            return subscription;
        };
        ScopeController.prototype._updater = function (nextState, merge, log) {
            this.updateStore(this.scopeName, nextState, merge);
            if (log) {
                console.log("[" + this.stateChangeCounter + "] After change");
                console.log(nextState);
            }
            this.stateChangeCounter++;
        };
        ScopeController.prototype.next = function (input, merge, action) {
            var _this = this;
            if (merge === void 0) { merge = true; }
            if (this.closed) {
                return;
            }
            var prevScopeState = this.getScopeState();
            var showLog = prevScopeState.get('__log');
            var nextScopeState, nextState;
            if (typeof input === 'function') {
                nextState = input(prevScopeState.get('state'));
            }
            else {
                nextState = input;
            }
            nextScopeState = prevScopeState.set('state', Immutable.fromJS(nextState));
            if (showLog) {
                console.log("[" + this.stateChangeCounter + "] Before change");
                if (action) {
                    console.log("[" + this.stateChangeCounter + "] Action");
                    console.log(action);
                }
                console.log(prevScopeState);
            }
            if (nextScopeState.get('state') instanceof Observable.Observable) {
                nextScopeState.get('state').subscribe(function (_data) {
                    _this._updater(nextScopeState.set('state', Immutable.fromJS(_data)), merge, showLog);
                });
            }
            else {
                this._updater(nextScopeState, merge, showLog);
            }
        };
        ScopeController.prototype.snapshot = function () {
            return this.getScopeState().get('state');
        };
        ScopeController.prototype.destroy = function () {
            this.unsubscribe$.next();
            this.unsubscribe$.complete();
            this.closed = true;
            this.store = null;
            this.stateObservable = null;
        };
        return ScopeController;
    }());

    var RxStoreFactory = /** @class */ (function () {
        function RxStoreFactory() {
            var _this = this;
            /**
             * 注入新的scope
             * @param {string} scopeName
             * @param {object} initialState
             * @memberof RxStoreFactory
             */
            this.injectScope = function (scopeName, initialState, reducer, cacheState, log) {
                if (cacheState === void 0) { cacheState = false; }
                if (log === void 0) { log = false; }
                if (!scopeName) {
                    throw new Error('You should provide a scope name to create a scope');
                }
                var prevScopeState = _this._getSnapshot(scopeName);
                if (prevScopeState && prevScopeState.get('__cached'))
                    return;
                var wrappedState = _this.createState(initialState, reducer, cacheState, log);
                // this.updateState(scopeName, wrappedState);
                var nextState = _this.store.value.set(scopeName, Immutable.fromJS(wrappedState));
                _this.store.next(nextState);
            };
            /**
             * 更新scope
             * @param {string} path
             * @param {object} state
             * @memberof RxStoreFactory
             */
            this.updateState = function (path, state, merge) {
                var nextState = _this._processInject(path.split('.'), _this.store.value, state, merge);
                _this.store.next(nextState);
            };
            /**
             * 生成当前store整体的快照，用于监视store状态。
             * 来回切换多个component发现subscription或者observers只增不减时，需要检查组件内是否释放了资源。
             */
            this.takeSnapshot = function () {
                return {
                    store: _this.store.value.toJS(),
                    observers: _this.store.observers,
                };
            };
            /**
             * 删除scope
             * @param {string} path
             * @memberof RxStoreFactory
             */
            this.deleteScope = function (path) {
                var nextState = _this.store.value.deleteIn(path.split('.'));
                _this.store.next(nextState);
            };
            /**
             * 获取scope subject
             * @param {string} path
             * @returns {object}
             * @memberof RxStoreFactory
             */
            this.getScopeController = function (scopeName) {
                var state = _this._getSnapshot(scopeName);
                if (!state) {
                    throw new Error('The scope you have required does not exist!');
                }
                var scopeId = state.get('__scopeId'); // eslint-disable-line
                var log = state.get('__log');
                return new ScopeController(scopeName, _this.store, _this.updateState);
            };
            // /**
            //  * 销毁store
            //  * @memberof RxStoreFactory
            //  */
            // destroy = () => {
            //   // TO DO: prevent memory leak
            //   this.store.complete();
            // }
            this.destroyScope = function (scopeName) {
                _this.deleteScope(scopeName);
            };
            this.store = new BehaviorSubject.BehaviorSubject(Immutable.Map());
            this.scopeId = 1;
        }
        /**
         *
         * @param {string []} path
         * @param {object} rootState
         * @param {object} initialState
         */
        RxStoreFactory.prototype._processInject = function (path, rootState, initialState, merge) {
            return merge
                ? rootState.mergeDeepIn(path, initialState)
                : rootState.updateIn(path, function () { return initialState; });
        };
        /**
         * 为scope初始化state
         * @param {object} [initialState={}]
         * @returns {object}
         * @memberof RxStoreFactory
         */
        RxStoreFactory.prototype.createState = function (initialState, reducer, cacheState, log) {
            if (initialState === void 0) { initialState = {}; }
            return {
                state: initialState,
                __scopeId: this.scopeId++,
                __reducer: reducer,
                __cached: cacheState,
                __log: log,
            };
        };
        /**
         * 生成当前scope的快照
         * @param {string[]} pluckPath
         * @returns {object}
         * @memberof RxStoreFactory
         */
        RxStoreFactory.prototype._getSnapshot = function (path) {
            return this.store.value.getIn(normalizePath(path));
        };
        return RxStoreFactory;
    }());

    var RxStore = new RxStoreFactory();
    function connect(options) {
        if (options.scope) {
            options.scopeName = options.scope;
        }
        return function wrap(WrappedComponent) {
            return /** @class */ (function (_super) {
                __extends(ConnectedComponent, _super);
                function ConnectedComponent(props, context) {
                    var _this = _super.call(this, props, context) || this;
                    _this.controllerSet = {};
                    _this.state = {};
                    _this.isConnected = false;
                    _this.isScopeRoot = false;
                    _this.stateToPropsNames = [];
                    if (typeof options.scopeName === 'string') {
                        _this.createScope(options.scopeName, options.reducer, options.cache, options.log);
                    }
                    if (isPlainObject(options.connectScopes)) {
                        _this.connectOptions = options.connectScopes;
                        _this.connectScope(_this.connectOptions);
                        _this.isConnected = true;
                    }
                    return _this;
                }
                ConnectedComponent.prototype.componentWillMount = function () {
                    this.mapStateToProps(this.controllerSet);
                };
                ConnectedComponent.prototype.shouldComponentUpdate = function (nextProps, nextState) {
                    if (nextProps !== this.props || nextState !== this.state) {
                        return true;
                    }
                    return false;
                };
                ConnectedComponent.prototype.componentWillUnmount = function () {
                    var _this = this;
                    Object.keys(this.controllerSet).forEach(function (key) {
                        _this.controllerSet[key].destroy();
                    });
                    this.controllerSet = null;
                };
                ConnectedComponent.prototype.createScope = function (name, reducer, cache, log) {
                    this.isScopeRoot = true;
                    RxStore.injectScope(name, options.initState, reducer, cache, log);
                    this.controllerSet[name] = this.bindListener(RxStore.getScopeController(name));
                };
                ConnectedComponent.prototype.connectScope = function (scopes) {
                    var _this = this;
                    Object.keys(scopes)
                        .filter(function (key) { return key !== options.scopeName; })
                        .forEach(function (key) {
                        var scopeController = RxStore.getScopeController(key);
                        _this.controllerSet[key] = _this.bindListener(scopeController);
                    });
                };
                ConnectedComponent.prototype.bindListener = function (controller) {
                    var bindedController = controller;
                    bindedController.listen = function (key, force) {
                        var _mapper;
                        var _do = function (observer) {
                            var subscription = controller.subscribe(observer, key, force, _mapper);
                            return subscription;
                        };
                        function pipe(mapper) {
                            _mapper = mapper;
                            return {
                                do: _do
                            };
                        }
                        return {
                            do: _do,
                            pipe: pipe
                        };
                    };
                    return bindedController;
                };
                ConnectedComponent.prototype.mapStateToProps = function (controllerSet) {
                    var _this = this;
                    if (this.isConnected) {
                        Object.keys(this.connectOptions).forEach(function (key) {
                            var mapProps = _this.connectOptions[key];
                            var controller = controllerSet[key];
                            if (typeof mapProps === 'string') {
                                _this.listenState(controller, toCamelcase(mapProps));
                            }
                            else if (isPlainObject(mapProps)) {
                                _this.listenState(controller, toCamelcase(mapProps.propName), mapProps.path, mapProps.selector);
                            }
                            else if (Array.isArray(mapProps)) {
                                mapProps.forEach(function (item) {
                                    if (typeof item === 'string') {
                                        _this.listenState(controller, toCamelcase(item));
                                    }
                                    else if (isPlainObject(item)) {
                                        _this.listenState(controller, toCamelcase(item.propName), item.path, item.selector);
                                    }
                                });
                            }
                        });
                    }
                };
                ConnectedComponent.prototype.listenState = function (subject, name, path, selector) {
                    var _this = this;
                    if (path === void 0) { path = [name]; }
                    this.stateToPropsNames.push(name);
                    subject
                        .listen(normalizePath(path), false)
                        .pipe(function (ob) { return selector ? ob.map(selector) : ob; })
                        .do(function (d) {
                        var _a;
                        _this.setState((_a = {},
                            _a[name] = d,
                            _a));
                    });
                };
                ConnectedComponent.prototype.getPropsInState = function () {
                    var _this = this;
                    var props = {};
                    this.stateToPropsNames.forEach(function (name) {
                        props[name] = _this.state[name];
                    });
                    return props;
                };
                ConnectedComponent.prototype.getInjectProps = function () {
                    // subject is deprecated, use controller(s) instead
                    var controllerKeys = Object.keys(this.controllerSet);
                    var props;
                    if (controllerKeys.length === 1) {
                        var controller = this.controllerSet[controllerKeys[0]];
                        props = {
                            listen: controller.listen,
                            dispatch: controller.dispatch,
                            subject: controller,
                            controller: controller,
                        };
                    }
                    else {
                        props = {
                            subject: this.controllerSet,
                            controllers: this.controllerSet,
                        };
                    }
                    return props;
                };
                ConnectedComponent.prototype.render = function () {
                    return (React.createElement(WrappedComponent, __assign({}, this.getPropsInState(), this.getInjectProps(), this.props)));
                };
                return ConnectedComponent;
            }(React.Component));
        };
    }

    function combineReducers(reducers) {
        return function (state, action) {
            var type = action.type;
            if (typeof reducers[type] === 'function') {
                return reducers[type](state, action);
            }
            throw new Error('Expected the reducer to be a function');
        };
    }

    exports.connect = connect;
    exports.RxStore = RxStore;
    exports.combineReducers = combineReducers;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
