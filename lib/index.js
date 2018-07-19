import * as React from 'react';
import { isPlainObject, toCamelcase, normalizePath } from './utils';
import { RxStoreFactory } from './base/factory';
export { combineReducers } from './base/combineReducers';
export const RxStore = new RxStoreFactory();
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
export function connect(scopeName, initState, connectScopes, reducer) {
    return function wrap(WrapComponent, usePureComponent = true) {
        return class WrappedComponent extends React.Component {
            constructor(props, context) {
                super(props, context);
                this.subjectMap = {};
                this.state = {};
                this.isConnected = false;
                this.isScopeRoot = false;
                this.stateToPropsNames = [];
                if (typeof scopeName === 'string') {
                    if (typeof connectScopes === 'function') {
                        reducer = connectScopes;
                    }
                    this.createScope(scopeName, reducer);
                }
                if (isPlainObject(scopeName) || isPlainObject(connectScopes)) {
                    this.connectOptions = isPlainObject(scopeName) ? scopeName : connectScopes;
                    this.connectScope(this.connectOptions);
                    this.isConnected = true;
                }
            }
            componentWillMount() {
                this.mapStateToProps(this.subjectMap);
            }
            shouldComponentUpdate(nextProps, nextState) {
                if (nextProps !== this.props || nextState !== this.state) {
                    return true;
                }
                return false;
            }
            componentWillUnmount() {
                Object.keys(this.subjectMap).forEach(key => {
                    this.subjectMap[key].destroy();
                });
                this.subjectMap = null;
            }
            createScope(name, reducer) {
                this.isScopeRoot = true;
                RxStore.injectScope(name, initState, reducer);
                this.subjectMap[name] = this.bindListener(RxStore.getStateSubject(name));
            }
            connectScope(scopes) {
                Object.keys(scopes).filter((key) => key !== scopeName).forEach((key) => {
                    const _subject = RxStore.getStateSubject(key);
                    this.subjectMap[key] = this.bindListener(_subject);
                });
            }
            bindListener(subject) {
                const bindedSubject = subject;
                bindedSubject.listen = (key) => {
                    let _mapper;
                    const _do = (observer) => {
                        const subscription = subject.subscribe(observer, key, _mapper);
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
                        pipe,
                    };
                };
                return bindedSubject;
            }
            mapStateToProps(subject) {
                if (this.isConnected) {
                    Object.keys(this.connectOptions).forEach((key) => {
                        const mapProps = this.connectOptions[key];
                        const subj = subject[key];
                        if (typeof mapProps === 'string') {
                            this.listenState(subj, toCamelcase(mapProps));
                        }
                        else if (isPlainObject(mapProps)) {
                            this.listenState(subj, toCamelcase(mapProps.propName), mapProps.path);
                        }
                        else if (Array.isArray(mapProps)) {
                            mapProps.forEach((item) => {
                                if (typeof item === 'string') {
                                    this.listenState(subj, toCamelcase(item));
                                }
                                else if (isPlainObject(item)) {
                                    this.listenState(subj, toCamelcase(item.propName), item.path);
                                }
                            });
                        }
                    });
                }
            }
            listenState(subject, name, path = [name]) {
                this.stateToPropsNames.push(name);
                subject
                    .listen(normalizePath(path))
                    .do(d => {
                    this.setState({
                        [name]: d,
                    });
                });
            }
            getPropsInState() {
                const props = {};
                this.stateToPropsNames.forEach((name) => {
                    props[name] = this.state[name];
                });
                return props;
            }
            getInjectProps() {
                const subjectsKey = Object.keys(this.subjectMap);
                let props;
                if (subjectsKey.length === 1) {
                    const subject = this.subjectMap[subjectsKey[0]];
                    props = {
                        listen: subject.listen,
                        dispatch: subject.dispatch,
                        subject,
                    };
                }
                else {
                    props = {
                        subject: this.subjectMap,
                    };
                }
                return props;
            }
            render() {
                return (React.createElement(WrapComponent, Object.assign({}, this.getPropsInState(), this.getInjectProps(), this.props)));
            }
        };
    };
}