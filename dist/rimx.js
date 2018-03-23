(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("immutable"), require("react"), require("rxjs/add/operator/map"), require("rxjs/Subject"), require("rxjs/BehaviorSubject"), require("rxjs/add/operator/distinctUntilChanged"));
	else if(typeof define === 'function' && define.amd)
		define(["immutable", "react", "rxjs/add/operator/map", "rxjs/Subject", "rxjs/BehaviorSubject", "rxjs/add/operator/distinctUntilChanged"], factory);
	else if(typeof exports === 'object')
		exports["RimX"] = factory(require("immutable"), require("react"), require("rxjs/add/operator/map"), require("rxjs/Subject"), require("rxjs/BehaviorSubject"), require("rxjs/add/operator/distinctUntilChanged"));
	else
		root["RimX"] = factory(root["immutable"], root["react"], root["rxjs/add/operator/map"], root["rxjs/Subject"], root["rxjs/BehaviorSubject"], root["rxjs/add/operator/distinctUntilChanged"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE__0__, __WEBPACK_EXTERNAL_MODULE__1__, __WEBPACK_EXTERNAL_MODULE__2__, __WEBPACK_EXTERNAL_MODULE__3__, __WEBPACK_EXTERNAL_MODULE__4__, __WEBPACK_EXTERNAL_MODULE__6__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__0__;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__1__;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__2__;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__3__;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__4__;

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: external {"commonjs":"react","commonjs2":"react","amd":"react","root":"react"}
var external_commonjs_react_commonjs2_react_amd_react_root_react_ = __webpack_require__(1);

// CONCATENATED MODULE: ./src/utils.ts
function isPlainObject(value) {
    return (value && (value.constructor === Object || value.constructor === undefined));
}
function toCamelcase(value) {
    return value.replace(/-([a-z])/ig, function (all, letter) { return letter.toUpperCase(); });
}

// EXTERNAL MODULE: external "rxjs/BehaviorSubject"
var BehaviorSubject_ = __webpack_require__(4);

// EXTERNAL MODULE: external "rxjs/add/operator/map"
var map_ = __webpack_require__(2);

// EXTERNAL MODULE: external {"commonjs":"immutable","commonjs2":"immutable","amd":"immutable","root":"immutable"}
var external_commonjs_immutable_commonjs2_immutable_amd_immutable_root_immutable_ = __webpack_require__(0);

// EXTERNAL MODULE: external "rxjs/Subject"
var Subject_ = __webpack_require__(3);

// EXTERNAL MODULE: external "rxjs/add/operator/distinctUntilChanged"
var distinctUntilChanged_ = __webpack_require__(6);

// CONCATENATED MODULE: ./src/base/utils.ts

function utils_isNativeType(variable) {
    return (typeof variable === "string" ||
        typeof variable === "number" ||
        typeof variable === "undefined" ||
        variable === null);
}
function utils_compareFn(a, b) {
    if (utils_isNativeType(a) && utils_isNativeType(b)) {
        return a === b;
    }
    return Object(external_commonjs_immutable_commonjs2_immutable_amd_immutable_root_immutable_["is"])(a, b);
}

// CONCATENATED MODULE: ./src/base/controlled-subject.ts
/**
 * @class ControlledSubject
 */




var controlled_subject_ControlledSubject = /** @class */ (function () {
    function ControlledSubject(path, scopeId, root) {
        var _this = this;
        this.path = path;
        this.pluckPath = path.split('.');
        this.root = root;
        this.scopeId = scopeId;
        this.streamControl = new Subject_["Subject"]();
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
        var _this = this;
        var root = this.root;
        // root.takeSnapshot();
        var observable = this.stateObservable;
        if (key) {
            observable = observable.map(function (d) { return d.getIn(key); }).distinctUntilChanged(utils_compareFn);
        }
        else {
            observable = observable.distinctUntilChanged(utils_compareFn);
        }
        if (mapper) {
            observable = mapper(observable);
        }
        var subscription = observable.subscribe(observer);
        var observerScopeControl = root.findScopeObservers(this.scopeId);
        if (observerScopeControl) {
            observerScopeControl.observers.push(subscription);
            root.observers.set(root.observers.findIndex(function (ob) {
                if (!ob) {
                    throw new Error("cannot find the observer list of scope " + _this.scopeId);
                }
                return ob.$scopeId === _this.scopeId;
            }), observerScopeControl);
        }
        else {
            throw new Error('Unknow error');
        }
        var unsubscribe = subscription.unsubscribe;
        subscription.unsubscribe = function _unsubscribe() {
            // const index = observerScopeControl.observers.findIndex((item) => item === subscription);
            // todo: delete item in array
            unsubscribe.call(subscription);
        };
        return subscription;
    };
    ControlledSubject.prototype.next = function (input) {
        if (this.closed) {
            return;
        }
        var newData;
        var root = this.root;
        if (typeof input === 'function') {
            var snapshot = root._getSnapshot(this.pluckPath); // eslint-disable-line
            newData = input(snapshot);
        }
        else {
            newData = input;
        }
        root.updateScope(this.path, newData);
    };
    ControlledSubject.prototype.snapshot = function () {
        return this.root._getSnapshot(this.pluckPath); // eslint-disable-line
    };
    ControlledSubject.prototype.destroy = function () {
        var _this = this;
        var root = this.root;
        var observerScopeControl = root.findScopeObservers(this.scopeId);
        this.closed = true;
        if (observerScopeControl) {
            observerScopeControl.observers.forEach(function (ob) { return ob.unsubscribe(); });
        }
        root.deleteScope(this.path);
        var index = root.observers.findIndex(function (ob) {
            if (!ob) {
                throw new Error("cannot find the observer list of scope " + _this.scopeId);
            }
            return ob.$scopeId === _this.scopeId;
        });
        root.observers = root.observers.delete(index);
    };
    return ControlledSubject;
}());


// CONCATENATED MODULE: ./src/base/factory.ts




var factory_RxStoreFactory = /** @class */ (function () {
    function RxStoreFactory() {
        this.store = new BehaviorSubject_["BehaviorSubject"](external_commonjs_immutable_commonjs2_immutable_amd_immutable_root_immutable_["Map"]());
        this.scopeId = 1;
        this.observers = external_commonjs_immutable_commonjs2_immutable_amd_immutable_root_immutable_["List"]([]);
    }
    /**
     * 注入新的scope
     * @param {string} [path='']
     * @param {object} initialState
     * @memberof RxStoreFactory
     */
    RxStoreFactory.prototype.injectScope = function (path, initialState) {
        if (path === void 0) { path = ''; }
        var wrappedState = this.initScope(initialState);
        this.updateScope(path, wrappedState);
    };
    /**
     * 更新scope
     * @param {string} path
     * @param {object} state
     * @memberof RxStoreFactory
     */
    RxStoreFactory.prototype.updateScope = function (path, state) {
        var _this = this;
        var nextState;
        var subscription = this.store.subscribe({
            next: function (rootState) {
                nextState = _this._processInject(path.split('.'), rootState, state); // eslint-disable-line
            },
            error: function (err) {
                throw new Error(err);
            },
        });
        subscription.unsubscribe();
        this.store.next(nextState);
    };
    /**
     * 生成当前store整体的快照，用于监视store状态。
     * 来回切换多个component发现subscription或者observers只增不减时，需要检查组件内是否释放了资源。
     */
    RxStoreFactory.prototype.takeSnapshot = function () {
        var _this = this;
        var subscription = this.store.subscribe(function (d) {
            console.group('RxStore snapshot');
            console.log('root state: ', d.toJS());
            console.log("subscriptions(" + _this.observers.size + "): ", _this.observers.toJS());
            console.log("subject observers(" + _this.store.observers.length + "): ", _this.store.observers);
            console.groupEnd();
        });
        subscription.unsubscribe();
    };
    /**
     * 删除scope
     * @param {string} path
     * @memberof RxStoreFactory
     */
    RxStoreFactory.prototype.deleteScope = function (path) {
        var nextState;
        var subscription = this.store.subscribe({
            next: function (rootState) {
                nextState = rootState.deleteIn(path.split('.'));
            },
            error: function (err) {
                throw new Error(err);
            },
        });
        subscription.unsubscribe();
        this.store.next(nextState);
    };
    /**
     *
     * @param {string []} path
     * @param {object} rootState
     * @param {object} initialState
     */
    RxStoreFactory.prototype._processInject = function (path, rootState, initialState) {
        return rootState.mergeIn(path, initialState);
    };
    /**
     * 为scope初始化state
     * @param {object} [initialState={}]
     * @returns {object}
     * @memberof RxStoreFactory
     */
    RxStoreFactory.prototype.initScope = function (initialState) {
        if (initialState === void 0) { initialState = {}; }
        var scopeId = this.scopeId++; // eslint-disable-line
        this.observers = this.observers.push({
            $scopeId: scopeId,
            observers: [],
        });
        return Object.assign(initialState, {
            $scopeId: scopeId,
        });
    };
    /**
     * 查找scope内的observer
     * @param {number} scopeId
     * @returns {object}
     * @memberof RxStoreFactory
     */
    RxStoreFactory.prototype.findScopeObservers = function (scopeId) {
        var _this = this;
        return this.observers.find(function (ob) {
            if (!ob) {
                throw new Error("cannot find the observer list of scope " + _this.scopeId);
            }
            return ob.$scopeId === scopeId;
        });
    };
    /**
     * 生成当前scope的快照
     * @param {string[]} pluckPath
     * @returns {object}
     * @memberof RxStoreFactory
     */
    RxStoreFactory.prototype._getSnapshot = function (pluckPath) {
        var snapshot;
        var subscription = this.store
            .map(function (rootState) { return rootState.getIn(pluckPath); })
            .subscribe(function (d) {
            snapshot = d;
        });
        subscription.unsubscribe();
        return snapshot;
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
        return new controlled_subject_ControlledSubject(path, scopeId, this);
    };
    /**
     * 销毁store
     * @memberof RxStoreFactory
     */
    RxStoreFactory.prototype.destroy = function () {
        // TO DO: prevent memory leak
        this.store.complete();
    };
    return RxStoreFactory;
}());


// CONCATENATED MODULE: ./src/index.tsx
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RxStore", function() { return src_RxStore; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "connect", function() { return src_connect; });
var src_extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var src_assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};



var src_RxStore = new factory_RxStoreFactory();
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
function src_connect(scopeName, initState, connectScopes) {
    return function wrap(WrapComponent) {
        return /** @class */ (function (_super) {
            src_extends(WrappedComponent, _super);
            function WrappedComponent(p, s) {
                var _this = _super.call(this, p, s) || this;
                _this.subject = {};
                _this.state = {};
                _this.listeners = [];
                _this.isConnected = false;
                _this.stateToPropsNames = [];
                if (typeof scopeName === 'string') {
                    _this.createScope(scopeName);
                }
                if (isPlainObject(scopeName) || isPlainObject(connectScopes)) {
                    _this.connectOptions = isPlainObject(scopeName) ? scopeName : connectScopes;
                    _this.connectScope(_this.connectOptions);
                    _this.isConnected = true;
                }
                return _this;
            }
            WrappedComponent.prototype.componentWillMount = function () {
                this.mapStateToProps(this.subject);
            };
            WrappedComponent.prototype.createScope = function (name) {
                src_RxStore.injectScope(name, initState);
                this.subject[name] = this.bindListener(src_RxStore.getStateSubject(name));
            };
            WrappedComponent.prototype.connectScope = function (scopes) {
                var _this = this;
                Object.keys(scopes).filter(function (key) { return key !== scopeName; }).forEach(function (key) {
                    var _subject = src_RxStore.getStateSubject(key);
                    _this.subject[key] = _this.bindListener(_subject);
                });
            };
            WrappedComponent.prototype.componentWillUnmount = function () {
                this.listeners.forEach(function (listener) {
                    listener.unsubscribe();
                });
            };
            WrappedComponent.prototype.bindListener = function (subject) {
                var _this = this;
                var bindedSubject = subject;
                bindedSubject.listen = function (observer, key, mapper) {
                    var subscription = subject.subscribe(observer, key, mapper);
                    _this.listeners.push(subscription);
                    return subscription;
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
                subject.listen(function (d) {
                    _this.setState((_a = {},
                        _a[name] = d,
                        _a));
                    var _a;
                }, path);
            };
            WrappedComponent.prototype.getProps = function () {
                var _this = this;
                var props = {};
                this.stateToPropsNames.forEach(function (name) {
                    props[name] = _this.state[name];
                });
                return props;
            };
            WrappedComponent.prototype.getSubjectInstance = function () {
                if (this.isConnected) {
                    return this.subject;
                }
                else {
                    return this.subject[scopeName];
                }
            };
            WrappedComponent.prototype.render = function () {
                var valueProps = this.getProps();
                return (external_commonjs_react_commonjs2_react_amd_react_root_react_["createElement"](WrapComponent, src_assign({}, this.props, valueProps, { subject: this.getSubjectInstance() })));
            };
            return WrappedComponent;
        }(external_commonjs_react_commonjs2_react_amd_react_root_react_["PureComponent"]));
    };
}


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__6__;

/***/ })
/******/ ]);
});