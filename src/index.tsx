import * as React from 'react';
import { Subscription, Observable } from 'rxjs';

import { isPlainObject, toCamelcase, normalizePath } from './utils';
import { RxStoreFactory } from './base/factory';
import { ControlledSubject } from './base/controlled-subject';
import { Reducer, Action } from './base/types';
export { combineReducers } from './base/combineReducers';

interface ReactSubject extends ControlledSubject {
  listen?: (key: string[]) => {
    do: (observer) => Subscription,
    pipe: (ob: Observable<any>) => {
      do: (observer) => Subscription,
    },
  }
}

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
export function connect(scopeName: any, initState, connectScopes, reducer: Reducer) {
  return function wrap(WrapComponent) {
    return class WrappedComponent extends React.PureComponent<any, any> {
      subject: { [key: string]: ReactSubject } = {};
      state = {};
      listeners: Subscription[] = [];
      isConnected = false;
      stateToPropsNames: string[] = [];
      connectOptions: any;
      constructor(p, s) {
        super(p, s);
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
        this.mapStateToProps(this.subject);
      }
      createScope(name: string, reducer: Reducer) {
        RxStore.injectScope(name, initState, reducer);
        this.subject[name] = this.bindListener(RxStore.getStateSubject(name));
      }
      connectScope(scopes) {
        Object.keys(scopes).filter((key) => key !== scopeName).forEach((key) => {
          const _subject = RxStore.getStateSubject(key);
          this.subject[key] = this.bindListener(_subject)
        });
      }
      componentWillUnmount() {
        this.listeners.forEach((listener) => {
          listener.unsubscribe();
        });
      }
      bindListener(subject: ControlledSubject) {
        const bindedSubject: ReactSubject = subject;
        // bindedSubject.listen = (observer, key, mapper) => {
        //   const subscription = subject.subscribe(observer, key, mapper);
        //   this.listeners.push(subscription);
        //   return subscription;
        // };
        bindedSubject.listen = (key) => {
          let _mapper;
          
          const _do = (observer) => {
            const subscription = subject.subscribe(observer, key, _mapper);
            this.listeners.push(subscription);
            return subscription;
          }
          
          function pipe(mapper) {
            _mapper = mapper;
            return {
              do: _do,
            };
          }

          return {
            do: _do,
            pipe,
          }
        }
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
      listenState(subject: ReactSubject, name, path = [name]) {
        this.stateToPropsNames.push(name);
        subject
          .listen(normalizePath(path))
          .do(d => {
            this.setState({
              [name]: d,
            });
          });
      }
      getProps() {
        const props = {};
        this.stateToPropsNames.forEach((name) => {
          props[name] = this.state[name];
        });
        return props;
      }
      getSubjectInstance() {
        if (this.isConnected) {
          return this.subject;
        } else {
          return this.subject[scopeName];
        }
      }
      render() {
        const valueProps = this.getProps();
        return (
          <WrapComponent
            {...this.props}
            {...valueProps}
            subject={this.getSubjectInstance()}
          />
        );
      }
    };
  };
}
