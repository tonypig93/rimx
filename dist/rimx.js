(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("immutable"), require("react"), require("rxjs/BehaviorSubject"), require("rxjs/Subject"), require("rxjs/add/operator/distinctUntilChanged"), require("rxjs/add/operator/map"));
	else if(typeof define === 'function' && define.amd)
		define(["immutable", "react", "rxjs/BehaviorSubject", "rxjs/Subject", "rxjs/add/operator/distinctUntilChanged", "rxjs/add/operator/map"], factory);
	else if(typeof exports === 'object')
		exports["RimX"] = factory(require("immutable"), require("react"), require("rxjs/BehaviorSubject"), require("rxjs/Subject"), require("rxjs/add/operator/distinctUntilChanged"), require("rxjs/add/operator/map"));
	else
		root["RimX"] = factory(root[undefined], root[undefined], root["rxjs/BehaviorSubject"], root["rxjs/Subject"], root["rxjs/add/operator/distinctUntilChanged"], root["rxjs/add/operator/map"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_immutable__, __WEBPACK_EXTERNAL_MODULE_react__, __WEBPACK_EXTERNAL_MODULE_rxjs_BehaviorSubject__, __WEBPACK_EXTERNAL_MODULE_rxjs_Subject__, __WEBPACK_EXTERNAL_MODULE_rxjs_add_operator_distinctUntilChanged__, __WEBPACK_EXTERNAL_MODULE_rxjs_add_operator_map__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.tsx");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/base/controlled-subject.ts":
/*!****************************************!*\
  !*** ./src/base/controlled-subject.ts ***!
  \****************************************/
/*! exports provided: ControlledSubject */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ControlledSubject\", function() { return ControlledSubject; });\n/* harmony import */ var rxjs_Subject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs/Subject */ \"rxjs/Subject\");\n/* harmony import */ var rxjs_Subject__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(rxjs_Subject__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var rxjs_add_operator_distinctUntilChanged__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs/add/operator/distinctUntilChanged */ \"rxjs/add/operator/distinctUntilChanged\");\n/* harmony import */ var rxjs_add_operator_distinctUntilChanged__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(rxjs_add_operator_distinctUntilChanged__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var rxjs_add_operator_map__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/add/operator/map */ \"rxjs/add/operator/map\");\n/* harmony import */ var rxjs_add_operator_map__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(rxjs_add_operator_map__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils */ \"./src/base/utils.ts\");\n/**\r\n * @class ControlledSubject\r\n */\r\n\r\n\r\n\r\n\r\nvar ControlledSubject = /** @class */ (function () {\r\n    function ControlledSubject(path, scopeId, root) {\r\n        var _this = this;\r\n        this.path = path;\r\n        this.pluckPath = path.split('.');\r\n        this.root = root;\r\n        this.scopeId = scopeId;\r\n        this.streamControl = new rxjs_Subject__WEBPACK_IMPORTED_MODULE_0__[\"Subject\"]();\r\n        this.closed = false;\r\n        this.stateObservable = root.store\r\n            .asObservable()\r\n            .map(function (rootState) { return rootState.getIn(_this.pluckPath); });\r\n    }\r\n    /**\r\n     *\r\n     *\r\n     * @param {*} observer\r\n     * @returns\r\n     * @memberof ControlledSubject\r\n     */\r\n    ControlledSubject.prototype.subscribe = function (observer, key, mapper) {\r\n        var _this = this;\r\n        var root = this.root;\r\n        // root.takeSnapshot();\r\n        var observable = this.stateObservable;\r\n        if (key) {\r\n            observable = observable.map(function (d) { return d.getIn(key); }).distinctUntilChanged(_utils__WEBPACK_IMPORTED_MODULE_3__[\"compareFn\"]);\r\n        }\r\n        else {\r\n            observable = observable.distinctUntilChanged(_utils__WEBPACK_IMPORTED_MODULE_3__[\"compareFn\"]);\r\n        }\r\n        if (mapper) {\r\n            observable = mapper(observable);\r\n        }\r\n        var subscription = observable.subscribe(observer);\r\n        var observerScopeControl = root.findScopeObservers(this.scopeId);\r\n        if (observerScopeControl) {\r\n            observerScopeControl.observers.push(subscription);\r\n            root.observers.set(root.observers.findIndex(function (ob) {\r\n                if (!ob) {\r\n                    throw new Error(\"cannot find the observer list of scope \" + _this.scopeId);\r\n                }\r\n                return ob.$scopeId === _this.scopeId;\r\n            }), observerScopeControl);\r\n        }\r\n        else {\r\n            throw new Error('Unknow error');\r\n        }\r\n        var unsubscribe = subscription.unsubscribe;\r\n        subscription.unsubscribe = function _unsubscribe() {\r\n            // const index = observerScopeControl.observers.findIndex((item) => item === subscription);\r\n            // todo: delete item in array\r\n            unsubscribe.call(subscription);\r\n        };\r\n        return subscription;\r\n    };\r\n    ControlledSubject.prototype.next = function (input) {\r\n        if (this.closed) {\r\n            return;\r\n        }\r\n        var newData;\r\n        var root = this.root;\r\n        if (typeof input === 'function') {\r\n            var snapshot = root._getSnapshot(this.pluckPath); // eslint-disable-line\r\n            newData = input(snapshot);\r\n        }\r\n        else {\r\n            newData = input;\r\n        }\r\n        root.updateScope(this.path, newData);\r\n    };\r\n    ControlledSubject.prototype.snapshot = function () {\r\n        return this.root._getSnapshot(this.pluckPath); // eslint-disable-line\r\n    };\r\n    ControlledSubject.prototype.destroy = function () {\r\n        var _this = this;\r\n        var root = this.root;\r\n        var observerScopeControl = root.findScopeObservers(this.scopeId);\r\n        this.closed = true;\r\n        if (observerScopeControl) {\r\n            observerScopeControl.observers.forEach(function (ob) { return ob.unsubscribe(); });\r\n        }\r\n        root.deleteScope(this.path);\r\n        var index = root.observers.findIndex(function (ob) {\r\n            if (!ob) {\r\n                throw new Error(\"cannot find the observer list of scope \" + _this.scopeId);\r\n            }\r\n            return ob.$scopeId === _this.scopeId;\r\n        });\r\n        root.observers = root.observers.delete(index);\r\n    };\r\n    return ControlledSubject;\r\n}());\r\n\r\n\n\n//# sourceURL=webpack://RimX/./src/base/controlled-subject.ts?");

/***/ }),

/***/ "./src/base/factory.ts":
/*!*****************************!*\
  !*** ./src/base/factory.ts ***!
  \*****************************/
/*! exports provided: RxStoreFactory */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RxStoreFactory\", function() { return RxStoreFactory; });\n/* harmony import */ var rxjs_BehaviorSubject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs/BehaviorSubject */ \"rxjs/BehaviorSubject\");\n/* harmony import */ var rxjs_BehaviorSubject__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(rxjs_BehaviorSubject__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! immutable */ \"immutable\");\n/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(immutable__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _controlled_subject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./controlled-subject */ \"./src/base/controlled-subject.ts\");\n\r\n// import 'rxjs/add/operator/map';\r\n\r\n\r\nvar RxStoreFactory = /** @class */ (function () {\r\n    function RxStoreFactory() {\r\n        this.store = new rxjs_BehaviorSubject__WEBPACK_IMPORTED_MODULE_0__[\"BehaviorSubject\"](immutable__WEBPACK_IMPORTED_MODULE_1__[\"Map\"]());\r\n        this.scopeId = 1;\r\n        this.observers = immutable__WEBPACK_IMPORTED_MODULE_1__[\"List\"]([]);\r\n    }\r\n    /**\r\n     * 注入新的scope\r\n     * @param {string} [path='']\r\n     * @param {object} initialState\r\n     * @memberof RxStoreFactory\r\n     */\r\n    RxStoreFactory.prototype.injectScope = function (path, initialState) {\r\n        if (path === void 0) { path = ''; }\r\n        var wrappedState = this.initScope(initialState);\r\n        this.updateScope(path, wrappedState);\r\n    };\r\n    /**\r\n     * 更新scope\r\n     * @param {string} path\r\n     * @param {object} state\r\n     * @memberof RxStoreFactory\r\n     */\r\n    RxStoreFactory.prototype.updateScope = function (path, state) {\r\n        var _this = this;\r\n        var nextState;\r\n        var subscription = this.store.subscribe({\r\n            next: function (rootState) {\r\n                nextState = _this._processInject(path.split('.'), rootState, state); // eslint-disable-line\r\n            },\r\n            error: function (err) {\r\n                throw new Error(err);\r\n            },\r\n        });\r\n        subscription.unsubscribe();\r\n        this.store.next(nextState);\r\n    };\r\n    /**\r\n     * 生成当前store整体的快照，用于监视store状态。\r\n     * 来回切换多个component发现subscription或者observers只增不减时，需要检查组件内是否释放了资源。\r\n     */\r\n    RxStoreFactory.prototype.takeSnapshot = function () {\r\n        var _this = this;\r\n        var subscription = this.store.subscribe(function (d) {\r\n            console.group('RxStore snapshot');\r\n            console.log('root state: ', d.toJS());\r\n            console.log(\"subscriptions(\" + _this.observers.size + \"): \", _this.observers.toJS());\r\n            console.log(\"subject observers(\" + _this.store.observers.length + \"): \", _this.store.observers);\r\n            console.groupEnd();\r\n        });\r\n        subscription.unsubscribe();\r\n    };\r\n    /**\r\n     * 删除scope\r\n     * @param {string} path\r\n     * @memberof RxStoreFactory\r\n     */\r\n    RxStoreFactory.prototype.deleteScope = function (path) {\r\n        var nextState;\r\n        var subscription = this.store.subscribe({\r\n            next: function (rootState) {\r\n                nextState = rootState.deleteIn(path.split('.'));\r\n            },\r\n            error: function (err) {\r\n                throw new Error(err);\r\n            },\r\n        });\r\n        subscription.unsubscribe();\r\n        this.store.next(nextState);\r\n    };\r\n    /**\r\n     *\r\n     * @param {string []} path\r\n     * @param {object} rootState\r\n     * @param {object} initialState\r\n     */\r\n    RxStoreFactory.prototype._processInject = function (path, rootState, initialState) {\r\n        return rootState.mergeIn(path, initialState);\r\n    };\r\n    /**\r\n     * 为scope初始化state\r\n     * @param {object} [initialState={}]\r\n     * @returns {object}\r\n     * @memberof RxStoreFactory\r\n     */\r\n    RxStoreFactory.prototype.initScope = function (initialState) {\r\n        if (initialState === void 0) { initialState = {}; }\r\n        var scopeId = this.scopeId++; // eslint-disable-line\r\n        this.observers = this.observers.push({\r\n            $scopeId: scopeId,\r\n            observers: [],\r\n        });\r\n        return Object.assign(initialState, {\r\n            $scopeId: scopeId,\r\n        });\r\n    };\r\n    /**\r\n     * 查找scope内的observer\r\n     * @param {number} scopeId\r\n     * @returns {object}\r\n     * @memberof RxStoreFactory\r\n     */\r\n    RxStoreFactory.prototype.findScopeObservers = function (scopeId) {\r\n        var _this = this;\r\n        return this.observers.find(function (ob) {\r\n            if (!ob) {\r\n                throw new Error(\"cannot find the observer list of scope \" + _this.scopeId);\r\n            }\r\n            return ob.$scopeId === scopeId;\r\n        });\r\n    };\r\n    /**\r\n     * 生成当前scope的快照\r\n     * @param {string[]} pluckPath\r\n     * @returns {object}\r\n     * @memberof RxStoreFactory\r\n     */\r\n    RxStoreFactory.prototype._getSnapshot = function (pluckPath) {\r\n        var snapshot;\r\n        var subscription = this.store\r\n            .map(function (rootState) { return rootState.getIn(pluckPath); })\r\n            .subscribe(function (d) {\r\n            snapshot = d;\r\n        });\r\n        subscription.unsubscribe();\r\n        return snapshot;\r\n    };\r\n    /**\r\n     * 获取scope subject\r\n     * @param {string} path\r\n     * @returns {object}\r\n     * @memberof RxStoreFactory\r\n     */\r\n    RxStoreFactory.prototype.getStateSubject = function (path) {\r\n        var pluckPath = path.split('.');\r\n        var scopeId = this._getSnapshot(pluckPath).get('$scopeId'); // eslint-disable-line\r\n        if (!scopeId) {\r\n            throw new Error('The state path you have required does not exist!');\r\n        }\r\n        return new _controlled_subject__WEBPACK_IMPORTED_MODULE_2__[\"ControlledSubject\"](path, scopeId, this);\r\n    };\r\n    /**\r\n     * 销毁store\r\n     * @memberof RxStoreFactory\r\n     */\r\n    RxStoreFactory.prototype.destroy = function () {\r\n        // TO DO: prevent memory leak\r\n        this.store.complete();\r\n    };\r\n    return RxStoreFactory;\r\n}());\r\n\r\n\n\n//# sourceURL=webpack://RimX/./src/base/factory.ts?");

/***/ }),

/***/ "./src/base/utils.ts":
/*!***************************!*\
  !*** ./src/base/utils.ts ***!
  \***************************/
/*! exports provided: compareFn */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"compareFn\", function() { return compareFn; });\n/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! immutable */ \"immutable\");\n/* harmony import */ var immutable__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(immutable__WEBPACK_IMPORTED_MODULE_0__);\n\r\nfunction isNativeType(variable) {\r\n    return (typeof variable === \"string\" ||\r\n        typeof variable === \"number\" ||\r\n        typeof variable === \"undefined\" ||\r\n        variable === null);\r\n}\r\nfunction compareFn(a, b) {\r\n    if (isNativeType(a) && isNativeType(b)) {\r\n        return a === b;\r\n    }\r\n    return Object(immutable__WEBPACK_IMPORTED_MODULE_0__[\"is\"])(a, b);\r\n}\r\n\n\n//# sourceURL=webpack://RimX/./src/base/utils.ts?");

/***/ }),

/***/ "./src/index.tsx":
/*!***********************!*\
  !*** ./src/index.tsx ***!
  \***********************/
/*! exports provided: RxStore, connect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"RxStore\", function() { return RxStore; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"connect\", function() { return connect; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ \"./src/utils.ts\");\n/* harmony import */ var _base_factory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./base/factory */ \"./src/base/factory.ts\");\nvar __extends = (undefined && undefined.__extends) || (function () {\r\n    var extendStatics = Object.setPrototypeOf ||\r\n        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\r\n        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\r\n    return function (d, b) {\r\n        extendStatics(d, b);\r\n        function __() { this.constructor = d; }\r\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\r\n    };\r\n})();\r\nvar __assign = (undefined && undefined.__assign) || Object.assign || function(t) {\r\n    for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n        s = arguments[i];\r\n        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n            t[p] = s[p];\r\n    }\r\n    return t;\r\n};\r\n\r\n\r\n\r\nvar RxStore = new _base_factory__WEBPACK_IMPORTED_MODULE_2__[\"RxStoreFactory\"]();\r\n/**\r\n * 宿主组件：创建scope的组件；连接组件：连接到其他宿主组件的scope的组件。\r\n * scopeName是字符串时，表示要创建新的scope，此时initState有效，connectScopes表示需要连接的scope\r\n * scopeName是对象时，表示要创建连接组件，scopeName的key为要连接的scopeName，value为函数时，函数需要从scope snapshot中返回需要的值（mapStateToProps），prop key为key。\r\n * value为对象时，{ propName: string; map: (data) => data }\r\n *\r\n * @export\r\n * @param {any} scopeName\r\n * @param {any} initState\r\n * @param {any} connectScopes\r\n * @returns\r\n */\r\nfunction connect(scopeName, initState, connectScopes) {\r\n    return function wrap(WrapComponent) {\r\n        return /** @class */ (function (_super) {\r\n            __extends(WrappedComponent, _super);\r\n            function WrappedComponent(p, s) {\r\n                var _this = _super.call(this, p, s) || this;\r\n                _this.subject = {};\r\n                _this.state = {};\r\n                _this.listeners = [];\r\n                _this.isConnected = false;\r\n                _this.stateToPropsNames = [];\r\n                if (typeof scopeName === 'string') {\r\n                    _this.createScope(scopeName);\r\n                }\r\n                if (Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"isPlainObject\"])(scopeName) || Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"isPlainObject\"])(connectScopes)) {\r\n                    _this.connectOptions = Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"isPlainObject\"])(scopeName) ? scopeName : connectScopes;\r\n                    _this.connectScope(_this.connectOptions);\r\n                    _this.isConnected = true;\r\n                }\r\n                return _this;\r\n            }\r\n            WrappedComponent.prototype.componentWillMount = function () {\r\n                this.mapStateToProps(this.subject);\r\n            };\r\n            WrappedComponent.prototype.createScope = function (name) {\r\n                RxStore.injectScope(name, initState);\r\n                this.subject[name] = this.bindListener(RxStore.getStateSubject(name));\r\n            };\r\n            WrappedComponent.prototype.connectScope = function (scopes) {\r\n                var _this = this;\r\n                Object.keys(scopes).filter(function (key) { return key !== scopeName; }).forEach(function (key) {\r\n                    var _subject = RxStore.getStateSubject(key);\r\n                    _this.subject[key] = _this.bindListener(_subject);\r\n                });\r\n            };\r\n            WrappedComponent.prototype.componentWillUnmount = function () {\r\n                this.listeners.forEach(function (listener) {\r\n                    listener.unsubscribe();\r\n                });\r\n            };\r\n            WrappedComponent.prototype.bindListener = function (subject) {\r\n                var _this = this;\r\n                var bindedSubject = subject;\r\n                bindedSubject.listen = function (observer, key, mapper) {\r\n                    var subscription = subject.subscribe(observer, key, mapper);\r\n                    _this.listeners.push(subscription);\r\n                    return subscription;\r\n                };\r\n                return bindedSubject;\r\n            };\r\n            WrappedComponent.prototype.mapStateToProps = function (subject) {\r\n                var _this = this;\r\n                if (this.isConnected) {\r\n                    Object.keys(this.connectOptions).forEach(function (key) {\r\n                        var mapProps = _this.connectOptions[key];\r\n                        var subj = subject[key];\r\n                        if (typeof mapProps === 'string') {\r\n                            _this.listenState(subj, Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"toCamelcase\"])(mapProps));\r\n                        }\r\n                        else if (Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"isPlainObject\"])(mapProps)) {\r\n                            _this.listenState(subj, Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"toCamelcase\"])(mapProps.propName), mapProps.path);\r\n                        }\r\n                        else if (Array.isArray(mapProps)) {\r\n                            mapProps.forEach(function (item) {\r\n                                if (typeof item === 'string') {\r\n                                    _this.listenState(subj, Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"toCamelcase\"])(item));\r\n                                }\r\n                                else if (Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"isPlainObject\"])(item)) {\r\n                                    _this.listenState(subj, Object(_utils__WEBPACK_IMPORTED_MODULE_1__[\"toCamelcase\"])(item.propName), item.path);\r\n                                }\r\n                            });\r\n                        }\r\n                    });\r\n                }\r\n            };\r\n            WrappedComponent.prototype.listenState = function (subject, name, path) {\r\n                var _this = this;\r\n                if (path === void 0) { path = [name]; }\r\n                this.stateToPropsNames.push(name);\r\n                subject.listen(function (d) {\r\n                    _this.setState((_a = {},\r\n                        _a[name] = d,\r\n                        _a));\r\n                    var _a;\r\n                }, path);\r\n            };\r\n            WrappedComponent.prototype.getProps = function () {\r\n                var _this = this;\r\n                var props = {};\r\n                this.stateToPropsNames.forEach(function (name) {\r\n                    props[name] = _this.state[name];\r\n                });\r\n                return props;\r\n            };\r\n            WrappedComponent.prototype.getSubject = function () {\r\n                if (this.isConnected) {\r\n                    return this.subject;\r\n                }\r\n                else {\r\n                    return this.subject[scopeName];\r\n                }\r\n            };\r\n            WrappedComponent.prototype.render = function () {\r\n                var valueProps = this.getProps();\r\n                return (react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](WrapComponent, __assign({}, this.props, valueProps, { subject: this.getSubject() })));\r\n            };\r\n            return WrappedComponent;\r\n        }(react__WEBPACK_IMPORTED_MODULE_0__[\"PureComponent\"]));\r\n    };\r\n}\r\n\n\n//# sourceURL=webpack://RimX/./src/index.tsx?");

/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/*! exports provided: isPlainObject, toCamelcase */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isPlainObject\", function() { return isPlainObject; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"toCamelcase\", function() { return toCamelcase; });\nfunction isPlainObject(value) {\r\n    return (value && (value.constructor === Object || value.constructor === undefined));\r\n}\r\nfunction toCamelcase(value) {\r\n    return value.replace(/-([a-z])/ig, function (all, letter) { return letter.toUpperCase(); });\r\n}\r\n\n\n//# sourceURL=webpack://RimX/./src/utils.ts?");

/***/ }),

/***/ "immutable":
/*!***********************************************************************************!*\
  !*** external {"commonjs":"immutable","commonjs2":"immutable","amd":"immutable"} ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_immutable__;\n\n//# sourceURL=webpack://RimX/external_%7B%22commonjs%22:%22immutable%22,%22commonjs2%22:%22immutable%22,%22amd%22:%22immutable%22%7D?");

/***/ }),

/***/ "react":
/*!***********************************************************************!*\
  !*** external {"commonjs":"react","commonjs2":"react","amd":"react"} ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_react__;\n\n//# sourceURL=webpack://RimX/external_%7B%22commonjs%22:%22react%22,%22commonjs2%22:%22react%22,%22amd%22:%22react%22%7D?");

/***/ }),

/***/ "rxjs/BehaviorSubject":
/*!***************************************!*\
  !*** external "rxjs/BehaviorSubject" ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_rxjs_BehaviorSubject__;\n\n//# sourceURL=webpack://RimX/external_%22rxjs/BehaviorSubject%22?");

/***/ }),

/***/ "rxjs/Subject":
/*!*******************************!*\
  !*** external "rxjs/Subject" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_rxjs_Subject__;\n\n//# sourceURL=webpack://RimX/external_%22rxjs/Subject%22?");

/***/ }),

/***/ "rxjs/add/operator/distinctUntilChanged":
/*!*********************************************************!*\
  !*** external "rxjs/add/operator/distinctUntilChanged" ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_rxjs_add_operator_distinctUntilChanged__;\n\n//# sourceURL=webpack://RimX/external_%22rxjs/add/operator/distinctUntilChanged%22?");

/***/ }),

/***/ "rxjs/add/operator/map":
/*!****************************************!*\
  !*** external "rxjs/add/operator/map" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_rxjs_add_operator_map__;\n\n//# sourceURL=webpack://RimX/external_%22rxjs/add/operator/map%22?");

/***/ })

/******/ });
});