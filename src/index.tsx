import * as React from 'react';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { normalizePath, isPlainObject, toCamelcase } from './base/utils';
import { RxStoreFactory } from './base/factory';
import { ScopeController } from './base/scope-controller';
import { Reducer, Action } from './base/types';
export { combineReducers } from './base/combineReducers';

interface ReactSubject extends ScopeController {
  listen?: (
    key: string[]
  ) => {
    do: (observer) => Subscription;
    pipe: (
      ob: Observable<any>
    ) => {
      do: (observer) => Subscription;
    };
  };
}

interface Options {
  scope: string;
  scopeName: string;
  initState: any;
  connectScopes?: {
    [scopeName: string]: any;
  };
  reducer?: Reducer;
  cache?: boolean;
  log?: boolean;
}

export const RxStore = new RxStoreFactory();

export function connect(options: Options) {
  // const { scopeName, initState, connectScopes, reducer, cache } = this.options;
  if (options.scope) {
    options.scopeName = options.scope;
  }
  return function wrap(WrapComponent) {
    return class WrappedComponent extends React.Component<any, any> {
      subjectMap: { [key: string]: ReactSubject } = {};
      state = {};
      isConnected = false;
      isScopeRoot = false;
      stateToPropsNames: string[] = [];
      connectOptions: any;
      constructor(props, context) {
        super(props, context);
        if (typeof options.scopeName === 'string') {
          this.createScope(
            options.scopeName,
            options.reducer,
            options.cache,
            options.log
          );
        }
        if (isPlainObject(options.connectScopes)) {
          this.connectOptions = options.connectScopes;
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
      createScope(
        name: string,
        reducer: Reducer,
        cache: boolean,
        log: boolean
      ) {
        this.isScopeRoot = true;
        RxStore.injectScope(name, options.initState, reducer, cache, log);
        this.subjectMap[name] = this.bindListener(RxStore.getScope(name));
      }
      connectScope(scopes) {
        Object.keys(scopes)
          .filter(key => key !== options.scopeName)
          .forEach(key => {
            const _subject = RxStore.getScope(key);
            this.subjectMap[key] = this.bindListener(_subject);
          });
      }

      bindListener(subject: ScopeController) {
        const bindedSubject: ReactSubject = subject;
        bindedSubject.listen = key => {
          let _mapper;

          const _do = observer => {
            const subscription = subject.subscribe(observer, key, _mapper);
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
            pipe
          };
        };
        return bindedSubject;
      }
      mapStateToProps(subject) {
        if (this.isConnected) {
          Object.keys(this.connectOptions).forEach(key => {
            const mapProps = this.connectOptions[key];
            const subj = subject[key];
            if (typeof mapProps === 'string') {
              this.listenState(subj, toCamelcase(mapProps));
            } else if (isPlainObject(mapProps)) {
              this.listenState(
                subj,
                toCamelcase(mapProps.propName),
                mapProps.path
              );
            } else if (Array.isArray(mapProps)) {
              mapProps.forEach(item => {
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
        subject.listen(normalizePath(path)).do(d => {
          this.setState({
            [name]: d
          });
        });
      }
      getPropsInState() {
        const props = {};
        this.stateToPropsNames.forEach(name => {
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
            subject
          };
        } else {
          props = {
            subject: this.subjectMap
          };
        }
        return props;
      }
      render() {
        return (
          <WrapComponent
            {...this.getPropsInState()}
            {...this.getInjectProps()}
            {...this.props}
          />
        );
      }
    };
  };
}
