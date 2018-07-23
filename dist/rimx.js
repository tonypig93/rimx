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

    function isPlainObject(value) {
        return (value && (value.constructor === Object || value.constructor === undefined));
    }
    function toCamelcase(value) {
        return value.replace(/-([a-z])/ig, function (all, letter) { return letter.toUpperCase(); });
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

    function isNativeType(variable) {
        return (typeof variable === "string" ||
            typeof variable === "number" ||
            typeof variable === "undefined" ||
            variable === null);
    }
    function compareFn(a, b) {
        if (isNativeType(a) && isNativeType(b)) {
            return a === b;
        }
        return Immutable.is(a, b);
    }

    /**
     * @class ControlledSubject
     */
    var ControlledSubject = /** @class */ (function () {
        function ControlledSubject(path, scopeId, root) {
            var _this = this;
            this.unsubscribe$ = new Subject.Subject();
            this.dispatch = function (action) {
                var reducer = _this.root.SCOPE[_this.path].reducer;
                _this.next(function (state) { return reducer(state, action); });
            };
            this.path = path;
            this.pluckPath = path.split('.');
            this.root = root;
            this.scopeId = scopeId;
            this.closed = false;
            this.stateObservable = root.store
                .asObservable()
                .map(function (rootState) { return rootState.getIn(_this.pluckPath); });
        }
        /**
         *
         *
         * @param {*} observer
         * @returns
         * @memberof ControlledSubject
         */
        ControlledSubject.prototype.subscribe = function (observer, key, mapper) {
            var root = this.root;
            // root.takeSnapshot();
            var observable = this.stateObservable;
            if (key) {
                observable = observable.map(function (d) { return d.getIn(key); }).distinctUntilChanged(compareFn);
            }
            else {
                observable = observable.distinctUntilChanged(compareFn);
            }
            if (mapper) {
                observable = mapper(observable);
            }
            var subscription = observable.takeUntil(this.unsubscribe$).subscribe(observer);
            return subscription;
        };
        ControlledSubject.prototype.next = function (input) {
            var _this = this;
            if (this.closed) {
                return;
            }
            var nextState;
            var root = this.root;
            if (typeof input === 'function') {
                var snapshot = root._getSnapshot(this.pluckPath); // eslint-disable-line
                nextState = input(snapshot);
            }
            else {
                nextState = input;
            }
            if (nextState instanceof Observable.Observable) {
                nextState.subscribe(function (_data) {
                    root.updateState(_this.path, _data);
                });
            }
            else {
                root.updateState(this.path, nextState);
            }
        };
        ControlledSubject.prototype.snapshot = function () {
            return this.root._getSnapshot(this.pluckPath); // eslint-disable-line
        };
        ControlledSubject.prototype.destroy = function () {
            this.unsubscribe$.next();
            this.unsubscribe$.complete();
            this.closed = true;
            this.root = null;
            this.stateObservable = null;
        };
        return ControlledSubject;
    }());

    var RxStoreFactory = /** @class */ (function () {
        function RxStoreFactory() {
            this.SCOPE = {};
            this.store = new BehaviorSubject.BehaviorSubject(Immutable.Map());
            this.scopeId = 1;
        }
        /**
         * 注入新的scope
         * @param {string} scopeName
         * @param {object} initialState
         * @memberof RxStoreFactory
         */
        RxStoreFactory.prototype.injectScope = function (scopeName, initialState, reducer, cacheState) {
            if (scopeName === void 0) { scopeName = ''; }
            if (cacheState === void 0) { cacheState = false; }
            var prevScopeState = this._getSnapshot([scopeName]);
            if (prevScopeState && prevScopeState.__cached)
                return;
            var wrappedState = this.createState(initialState, cacheState);
            this.SCOPE[scopeName] = {
                reducer: reducer,
            };
            // this.updateState(scopeName, wrappedState);
            var nextState = this.store.value.set(scopeName, Immutable.fromJS(wrappedState));
            this.store.next(nextState);
        };
        /**
         * 更新scope
         * @param {string} path
         * @param {object} state
         * @memberof RxStoreFactory
         */
        RxStoreFactory.prototype.updateState = function (path, state) {
            var nextState = this._processInject(path.split('.'), this.store.value, state);
            this.store.next(nextState);
        };
        /**
         * 生成当前store整体的快照，用于监视store状态。
         * 来回切换多个component发现subscription或者observers只增不减时，需要检查组件内是否释放了资源。
         */
        RxStoreFactory.prototype.takeSnapshot = function () {
            console.group('RxStore snapshot');
            console.log('root state: ', this.store.value.toJS());
            console.log("subject observers(" + this.store.observers.length + "): ", this.store.observers);
            console.groupEnd();
        };
        /**
         * 删除scope
         * @param {string} path
         * @memberof RxStoreFactory
         */
        RxStoreFactory.prototype.deleteScope = function (path) {
            var nextState = this.store.value.deleteIn(path.split('.'));
            this.store.next(nextState);
        };
        /**
         *
         * @param {string []} path
         * @param {object} rootState
         * @param {object} initialState
         */
        RxStoreFactory.prototype._processInject = function (path, rootState, initialState) {
            return rootState.mergeDeepIn(path, initialState);
        };
        /**
         * 为scope初始化state
         * @param {object} [initialState={}]
         * @returns {object}
         * @memberof RxStoreFactory
         */
        RxStoreFactory.prototype.createState = function (initialState, cacheState) {
            if (initialState === void 0) { initialState = {}; }
            var scopeId = this.scopeId++; // eslint-disable-line
            return Object.assign(initialState, {
                $scopeId: scopeId,
                __cached: cacheState,
            });
        };
        /**
         * 生成当前scope的快照
         * @param {string[]} pluckPath
         * @returns {object}
         * @memberof RxStoreFactory
         */
        RxStoreFactory.prototype._getSnapshot = function (pluckPath) {
            return this.store.value.getIn(pluckPath);
        };
        /**
         * 获取scope subject
         * @param {string} path
         * @returns {object}
         * @memberof RxStoreFactory
         */
        RxStoreFactory.prototype.getStateSubject = function (path) {
            var pluckPath = path.split('.');
            var scopeId = this._getSnapshot(pluckPath).get('$scopeId'); // eslint-disable-line
            if (!scopeId) {
                throw new Error('The state path you have required does not exist!');
            }
            return new ControlledSubject(path, scopeId, this);
        };
        /**
         * 销毁store
         * @memberof RxStoreFactory
         */
        RxStoreFactory.prototype.destroy = function () {
            // TO DO: prevent memory leak
            this.store.complete();
        };
        RxStoreFactory.prototype.destroyScope = function (scopeName) {
            this.deleteScope(scopeName);
        };
        return RxStoreFactory;
    }());

    function combineReducers(reducers) {
        return function (state, action) {
            var type = action.type;
            if (typeof reducers[type] === 'function') {
                return reducers[type](state, action);
            }
            console.warn('reducer is not a function');
            return state;
        };
    }

    var RxStore = new RxStoreFactory();
    function connect(options) {
        // const { scopeName, initState, connectScopes, reducer, cache } = this.options;
        return function wrap(WrapComponent) {
            return /** @class */ (function (_super) {
                __extends(WrappedComponent, _super);
                function WrappedComponent(props, context) {
                    var _this = _super.call(this, props, context) || this;
                    _this.subjectMap = {};
                    _this.state = {};
                    _this.isConnected = false;
                    _this.isScopeRoot = false;
                    _this.stateToPropsNames = [];
                    if (typeof options.scopeName === 'string') {
                        _this.createScope(options.scopeName, options.reducer, options.cache);
                    }
                    if (isPlainObject(options.connectScopes)) {
                        _this.connectOptions = options.connectScopes;
                        _this.connectScope(_this.connectOptions);
                        _this.isConnected = true;
                    }
                    return _this;
                }
                WrappedComponent.prototype.componentWillMount = function () {
                    this.mapStateToProps(this.subjectMap);
                };
                WrappedComponent.prototype.shouldComponentUpdate = function (nextProps, nextState) {
                    if (nextProps !== this.props || nextState !== this.state) {
                        return true;
                    }
                    return false;
                };
                WrappedComponent.prototype.componentWillUnmount = function () {
                    var _this = this;
                    Object.keys(this.subjectMap).forEach(function (key) {
                        _this.subjectMap[key].destroy();
                    });
                    this.subjectMap = null;
                };
                WrappedComponent.prototype.createScope = function (name, reducer, cache) {
                    this.isScopeRoot = true;
                    RxStore.injectScope(name, options.initState, reducer, cache);
                    this.subjectMap[name] = this.bindListener(RxStore.getStateSubject(name));
                };
                WrappedComponent.prototype.connectScope = function (scopes) {
                    var _this = this;
                    Object.keys(scopes).filter(function (key) { return key !== options.scopeName; }).forEach(function (key) {
                        var _subject = RxStore.getStateSubject(key);
                        _this.subjectMap[key] = _this.bindListener(_subject);
                    });
                };
                WrappedComponent.prototype.bindListener = function (subject) {
                    var bindedSubject = subject;
                    bindedSubject.listen = function (key) {
                        var _mapper;
                        var _do = function (observer) {
                            var subscription = subject.subscribe(observer, key, _mapper);
                            return subscription;
                        };
                        function pipe(mapper) {
                            _mapper = mapper;
                            return {
                                do: _do,
                            };
                        }
                        return {
                            do: _do,
                            pipe: pipe,
                        };
                    };
                    return bindedSubject;
                };
                WrappedComponent.prototype.mapStateToProps = function (subject) {
                    var _this = this;
                    if (this.isConnected) {
                        Object.keys(this.connectOptions).forEach(function (key) {
                            var mapProps = _this.connectOptions[key];
                            var subj = subject[key];
                            if (typeof mapProps === 'string') {
                                _this.listenState(subj, toCamelcase(mapProps));
                            }
                            else if (isPlainObject(mapProps)) {
                                _this.listenState(subj, toCamelcase(mapProps.propName), mapProps.path);
                            }
                            else if (Array.isArray(mapProps)) {
                                mapProps.forEach(function (item) {
                                    if (typeof item === 'string') {
                                        _this.listenState(subj, toCamelcase(item));
                                    }
                                    else if (isPlainObject(item)) {
                                        _this.listenState(subj, toCamelcase(item.propName), item.path);
                                    }
                                });
                            }
                        });
                    }
                };
                WrappedComponent.prototype.listenState = function (subject, name, path) {
                    var _this = this;
                    if (path === void 0) { path = [name]; }
                    this.stateToPropsNames.push(name);
                    subject
                        .listen(normalizePath(path))
                        .do(function (d) {
                        _this.setState((_a = {},
                            _a[name] = d,
                            _a));
                        var _a;
                    });
                };
                WrappedComponent.prototype.getPropsInState = function () {
                    var _this = this;
                    var props = {};
                    this.stateToPropsNames.forEach(function (name) {
                        props[name] = _this.state[name];
                    });
                    return props;
                };
                WrappedComponent.prototype.getInjectProps = function () {
                    var subjectsKey = Object.keys(this.subjectMap);
                    var props;
                    if (subjectsKey.length === 1) {
                        var subject = this.subjectMap[subjectsKey[0]];
                        props = {
                            listen: subject.listen,
                            dispatch: subject.dispatch,
                            subject: subject,
                        };
                    }
                    else {
                        props = {
                            subject: this.subjectMap,
                        };
                    }
                    return props;
                };
                WrappedComponent.prototype.render = function () {
                    return (React.createElement(WrapComponent, __assign({}, this.getPropsInState(), this.getInjectProps(), this.props)));
                };
                return WrappedComponent;
            }(React.Component));
        };
    }
    /**
     * 宿主组件：创建scope的组件；连接组件：连接到其他宿主组件的scope的组件。
     * scopeName是字符串时，表示要创建新的scope，此时initState有效，connectScopes表示需要连接的scope
     * scopeName是对象时，表示要创建连接组件，scopeName的key为要连接的scopeName，value为函数时，函数需要从scope snapshot中返回需要的值（mapStateToProps），prop key为key。
     * value为对象时，{ propName: string; map: (data) => data }
     *
     * @export
     * @param {any} scopeName
     * @param {any} initState
     * @param {any} connectScopes
     * @returns
     */
    // export function connect(scopeName: any, initState, connectScopes, reducer: Reducer) {
    //   return function wrap(WrapComponent) {
    //     return class WrappedComponent extends React.Component<any, any> {
    //       subjectMap: { [key: string]: ReactSubject } = {};
    //       state = {};
    //       isConnected = false;
    //       isScopeRoot = false;
    //       stateToPropsNames: string[] = [];
    //       connectOptions: any;
    //       constructor(props, context) {
    //         super(props, context);
    //         if (typeof scopeName === 'string') {
    //           if (typeof connectScopes === 'function') {
    //             reducer = connectScopes;
    //           }
    //           this.createScope(scopeName, reducer);
    //         }
    //         if (isPlainObject(scopeName) || isPlainObject(connectScopes)) {
    //           this.connectOptions = isPlainObject(scopeName) ? scopeName : connectScopes;
    //           this.connectScope(this.connectOptions);
    //           this.isConnected = true;
    //         }
    //       }
    //       componentWillMount() {
    //         this.mapStateToProps(this.subjectMap);
    //       }
    //       shouldComponentUpdate(nextProps, nextState) {
    //         if (nextProps !== this.props || nextState !== this.state) {
    //           return true;
    //         }
    //         return false;
    //       }
    //       componentWillUnmount() {
    //         Object.keys(this.subjectMap).forEach(key => {
    //           this.subjectMap[key].destroy();
    //         });
    //         this.subjectMap = null;
    //       }
    //       createScope(name: string, reducer: Reducer) {
    //         this.isScopeRoot = true;
    //         RxStore.injectScope(name, initState, reducer);
    //         this.subjectMap[name] = this.bindListener(RxStore.getStateSubject(name));
    //       }
    //       connectScope(scopes) {
    //         Object.keys(scopes).filter((key) => key !== scopeName).forEach((key) => {
    //           const _subject = RxStore.getStateSubject(key);
    //           this.subjectMap[key] = this.bindListener(_subject)
    //         });
    //       }
    //       bindListener(subject: ControlledSubject) {
    //         const bindedSubject: ReactSubject = subject;
    //         bindedSubject.listen = (key) => {
    //           let _mapper;
    //           const _do = (observer) => {
    //             const subscription = subject.subscribe(observer, key, _mapper);
    //             return subscription;
    //           }
    //           function pipe(mapper) {
    //             _mapper = mapper;
    //             return {
    //               do: _do,
    //             };
    //           }
    //           return {
    //             do: _do,
    //             pipe,
    //           }
    //         }
    //         return bindedSubject;
    //       }
    //       mapStateToProps(subject) {
    //         if (this.isConnected) {
    //           Object.keys(this.connectOptions).forEach((key) => {
    //             const mapProps = this.connectOptions[key];
    //             const subj = subject[key];
    //             if (typeof mapProps === 'string') {
    //               this.listenState(subj, toCamelcase(mapProps));
    //             } else if (isPlainObject(mapProps)) {
    //               this.listenState(subj, toCamelcase(mapProps.propName), mapProps.path);
    //             } else if (Array.isArray(mapProps)) {
    //               mapProps.forEach((item) => {
    //                 if (typeof item === 'string') {
    //                   this.listenState(subj, toCamelcase(item));
    //                 } else if (isPlainObject(item)) {
    //                   this.listenState(subj, toCamelcase(item.propName), item.path);
    //                 }
    //               });
    //             }
    //           });
    //         }
    //       }
    //       listenState(subject: ReactSubject, name, path = [name]) {
    //         this.stateToPropsNames.push(name);
    //         subject
    //           .listen(normalizePath(path))
    //           .do(d => {
    //             this.setState({
    //               [name]: d,
    //             });
    //           });
    //       }
    //       getPropsInState() {
    //         const props = {};
    //         this.stateToPropsNames.forEach((name) => {
    //           props[name] = this.state[name];
    //         });
    //         return props;
    //       }
    //       getInjectProps() {
    //         const subjectsKey = Object.keys(this.subjectMap);
    //         let props;
    //         if (subjectsKey.length === 1) {
    //           const subject = this.subjectMap[subjectsKey[0]];
    //           props = {
    //             listen: subject.listen,
    //             dispatch: subject.dispatch,
    //             subject,
    //           };
    //         } else {
    //           props = {
    //             subject: this.subjectMap,
    //           };
    //         }
    //         return props;
    //       }
    //       render() {
    //         return (
    //           <WrapComponent
    //             {...this.getPropsInState()}
    //             {...this.getInjectProps()}
    //             {...this.props}
    //           />
    //         );
    //       }
    //     };
    //   };
    // }

    exports.RxStore = RxStore;
    exports.connect = connect;
    exports.combineReducers = combineReducers;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
