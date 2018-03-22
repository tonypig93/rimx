import React from 'react';
import { isPlainObject, toCamelcase } from './utils';
import { RxStoreFactory } from './base/factory';


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
export function connect(scopeName, initState, connectScopes) {
  return function wrap(WrapComponent) {
    return class WrappedComponent extends React.PureComponent {
      constructor() {
        super();
        this.subject = null;
        this.state = {};
        this.listeners = [];
        this.isConnected = false;
        this.stateToPropsNames = [];
        if (typeof scopeName === 'string') {
          this.createScope();
        }
        if (isPlainObject(scopeName) || isPlainObject(connectScopes)) {
          this.connectOptions = isPlainObject(scopeName) ? scopeName : connectScopes;
          this.connectScope(this.connectOptions);
          this.isConnected = true;
        }
      }
      componentWillMount() {
        this.mapStateToProps(this.subject);
      }
      get debugID() {
        return this._reactInternalInstance._debugID; //eslint-disable-line
      }
      createScope() { //eslint-disable-line
        RxStore.injectScope(scopeName, initState);
        this.subject = this.bindListener(RxStore.getStateSubject(scopeName));
        this.isScopeHoster = true;
      }
      connectScope(scopes) {
        if (this.subject) {
          this.subject = {
            [scopeName]: this.subject,
          };
        } else {
          this.subject = {};
        }
        Object.keys(scopes).filter((key) => key !== scopeName).forEach((key) => {
          const _subject = RxStore.getStateSubject(key);//eslint-disable-line
          this.subject[key] = this.bindListener(_subject);
        });
      }
      componentWillUnmount() {
        this.listeners.forEach((listener) => {
          listener.unsubscribe();
        });
      }
      bindListener(subject) {
        const bindedSubject = subject;
        bindedSubject.listen = (observer, k, mapper) => {
          const subscription = subject.subscribe(observer, k, mapper);
          this.listeners.push(subscription);
          return subscription;
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
            } else if (isPlainObject(mapProps)) {
              this.listenState(subj, toCamelcase(mapProps.propName), mapProps.path);
            } else if (Array.isArray(mapProps)) {
              mapProps.forEach((item) => {
                if (typeof item === 'string') {
                  this.listenState(subj, toCamelcase(item));
                } else if (isPlainObject(item)) {
                  this.listenState(subj, toCamelcase(item.propName), item.path);
                }
              });
            }
          });
        }
      }
      listenState(subject, name, path = [name]) {
        this.stateToPropsNames.push(name);
        subject.listen((d) => {
          this.setState({
            [name]: d,
          });
        }, path);
      }
      getProps() {
        const props = {};
        this.stateToPropsNames.forEach((name) => {
          props[name] = this.state[name];
        });
        return props;
      }
      getSubject(scopeName) {
        
      }
      render() {
        const valueProps = this.getProps();
        return (
          <WrapComponent
            {...this.props}
            {...valueProps}
            subject={this.subject} />
        );
      }
    };
  };
}
