import * as React from 'react';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { normalizePath, isPlainObject, toCamelcase } from './base/utils';
import { RxStoreFactory } from './base/factory';
import { ScopeController } from './base/scope-controller';
import { Reducer, Action } from './base/types';
export { combineReducers } from './base/combineReducers';

interface ReactScopeController extends ScopeController {
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
  if (options.scope) {
    options.scopeName = options.scope;
  }
  return function wrap(ConnectedComponent) {
    return class WrappedComponent extends React.Component<any, any> {
      controllerSet: { [key: string]: ReactScopeController } = {};
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
        this.mapStateToProps(this.controllerSet);
      }

      shouldComponentUpdate(nextProps, nextState) {
        if (nextProps !== this.props || nextState !== this.state) {
          return true;
        }
        return false;
      }

      componentWillUnmount() {
        Object.keys(this.controllerSet).forEach(key => {
          this.controllerSet[key].destroy();
        });

        this.controllerSet = null;
      }

      createScope(
        name: string,
        reducer: Reducer,
        cache: boolean,
        log: boolean
      ) {
        this.isScopeRoot = true;
        RxStore.injectScope(name, options.initState, reducer, cache, log);
        this.controllerSet[name] = this.bindListener(RxStore.getScope(name));
      }

      connectScope(scopes) {
        Object.keys(scopes)
          .filter(key => key !== options.scopeName)
          .forEach(key => {
            const scopeController = RxStore.getScope(key);
            this.controllerSet[key] = this.bindListener(scopeController);
          });
      }

      bindListener(subject: ScopeController) {
        const bindedController: ReactScopeController = subject;
        bindedController.listen = key => {
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
        return bindedController;
      }

      mapStateToProps(controllerSet) {
        if (this.isConnected) {
          Object.keys(this.connectOptions).forEach(key => {
            const mapProps = this.connectOptions[key];
            const controller = controllerSet[key];
            if (typeof mapProps === 'string') {
              this.listenState(controller, toCamelcase(mapProps));
            } else if (isPlainObject(mapProps)) {
              this.listenState(
                controller,
                toCamelcase(mapProps.propName),
                mapProps.path
              );
            } else if (Array.isArray(mapProps)) {
              mapProps.forEach(item => {
                if (typeof item === 'string') {
                  this.listenState(controller, toCamelcase(item));
                } else if (isPlainObject(item)) {
                  this.listenState(controller, toCamelcase(item.propName), item.path);
                }
              });
            }
          });
        }
      }

      listenState(subject: ReactScopeController, name: string, path = [name]) {
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
        // subject is deprecated, use controller(s) instead
        const controllerKeys = Object.keys(this.controllerSet);
        let props;
        if (controllerKeys.length === 1) {
          const controller = this.controllerSet[controllerKeys[0]];
          props = {
            listen: controller.listen,
            dispatch: controller.dispatch,
            subject: controller,
            controller,
          };
        } else {
          props = {
            subject: this.controllerSet,
            controllers: this.controllerSet,
          };
        }
        return props;
      }

      render() {
        return (
          <ConnectedComponent
            {...this.getPropsInState()}
            {...this.getInjectProps()}
            {...this.props}
          />
        );
      }
    };
  };
}
