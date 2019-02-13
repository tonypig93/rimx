import * as React from 'react';
import * as renderer from 'react-test-renderer';
import 'rxjs/add/operator/mapTo';
import { connect, RxStore } from '../../src/reactBinding';
import { combineReducers } from '../../src/base/combineReducers';

let Root$;

class Root extends React.Component<any, any> {
  handleClick = () => {
    this.props.handler && this.props.handler.call(this);
  }
  render() {
    return (
      <div onClick={this.handleClick}>{this.props.name}</div>
    )
  }
}

class A extends React.Component<any, any> {
  componentDidMount() {
    this.props.didMount && this.props.didMount.call(this);
  }

  handleClick = () => {
    this.props.handler && this.props.handler.call(this);
  }

  render() {
    return (
      <div onClick={this.handleClick}>{this.props.name}</div>
    )
  }
}


beforeEach(() => {
  Root$ = connect({
    scope: 'test',
    initState: {
      name: 'tony',
      list: [],
    },
    connectScopes: {
      test: 'name',
    },
    reducer,
  })(Root);
})

function reducer1(state, action) {
  return {
    name: action.payload,
  };
}

function reducer2(state, action) {
  return {
    list: action.payload,
  }
}
const reducer = combineReducers({
  changeName: reducer1,
  changeList: reducer2,
});

describe('React bindings', () => {
  test('create a scope with a component', () => {
    expect(Root$.name).toBe('ConnectedComponent');
    function handler() {
      this.props.dispatch({ type: 'changeName', payload: 'tom' });
    }

    const component = renderer.create(
      <Root$ handler={handler}></Root$>
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    tree.props.onClick();

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    component.unmount();
  })

  test('make a component link to the scope', () => {
    function handler() {
      this.props.dispatch({ type: 'changeName', payload: 'tom' });
    }
    const A$ = connect({
      connectScopes: {
        test: 'name',
      },
    })(A);

    const component_r = renderer.create(
      <Root$ handler={handler}></Root$>
    );

    const component_a = renderer.create(
      <A$></A$>
    );

    let tree_r = component_r.toJSON();
    expect(tree_r).toMatchSnapshot();

    let tree_a = component_a.toJSON();
    expect(tree_a).toMatchSnapshot();

    tree_r.props.onClick();

    tree_r = component_r.toJSON();
    expect(tree_r).toMatchSnapshot();

    tree_a = component_a.toJSON();
    expect(tree_a).toMatchSnapshot();

    component_r.unmount();
    component_a.unmount();
  });

  test('make a component link to the scope and using selector', () => {
    function handler() {
      this.props.dispatch({ type: 'changeName', payload: 'tom' });
    }
    const A$ = connect({
      connectScopes: {
        test: {
          propName: 'name',
          path: 'name',
          selector: (value) => {
            return `${value}_${value}`;
          },
        },
      },
    })(A);

    const component_r = renderer.create(
      <Root$ handler={handler}></Root$>
    );

    const component_a = renderer.create(
      <A$></A$>
    );

    let tree_r = component_r.toJSON();
    expect(tree_r).toMatchSnapshot();

    let tree_a = component_a.toJSON();
    expect(tree_a).toMatchSnapshot();

    tree_r.props.onClick();

    tree_r = component_r.toJSON();
    expect(tree_r).toMatchSnapshot();

    tree_a = component_a.toJSON();
    expect(tree_a).toMatchSnapshot();

    component_r.unmount();
    component_a.unmount();
  });

  test('make a component link to the scope and get two props', () => {

    class B extends React.Component<any, any> {
      changeState = () => {
        this.props.dispatch({ type: 'changeList', payload: ['A', 'B', 'C'] });
      }
      render() {
        return (
          <div onClick={this.changeState}>
            <span>{this.props.name}</span>
            <span>{this.props.list.join(',')}</span>
          </div>
        )
      }
    }
    const B$ = connect({
      connectScopes: {
        test: [{
          propName: 'name',
          path: 'name',
        }, {
          propName: 'list',
          path: 'list',
        }],
      },
    })(B);

    const component_r = renderer.create(
      <Root$></Root$>
    );

    const component_a = renderer.create(
      <B$></B$>
    );

    let tree_a = component_a.toJSON();
    expect(tree_a).toMatchSnapshot();

    tree_a.props.onClick();

    tree_a = component_a.toJSON();
    expect(tree_a).toMatchSnapshot();

    component_r.unmount();
    component_a.unmount();
  });

  test('change the state directly', () => {
    function handler() {
      this.props.controller.next(() => {
        return {
          name: 'eric',
        };
      });
    }
    const A$ = connect({
      connectScopes: {
        test: 'name',
      },
    })(A);

    const component_r = renderer.create(
      <Root$></Root$>
    );

    const component = renderer.create(
      <A$ handler={handler}></A$>
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    tree.props.onClick();

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    component.unmount();
    component_r.unmount();
  })

  test('listen state change', () => {
    class B extends React.Component<any, any> {
      state = {
        name: '',
      }
      componentDidMount() {
        this.props.listen(['name']).do(data => {
          this.setState({
            name: data,
          });
        })
      }
      handleClick = () => {
        this.props.dispatch({ type: 'changeName', payload: 'mary' });
      }
      render() {
        return (
          <div onClick={this.handleClick}>{this.state.name}</div>
        )
      }
    }
    const B$ = connect({
      connectScopes: {
        test: null,
      },
    })(B);

    const component_r = renderer.create(
      <Root$></Root$>
    );

    const component = renderer.create(
      <B$></B$>
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    tree.props.onClick();

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    component.unmount();
    component_r.unmount();

  })

  test('listen state change and using pipe', () => {
    class B extends React.Component<any, any> {
      state = {
        name: '',
      }
      componentDidMount() {
        this.props.listen(['name']).pipe(ob => ob.mapTo('jerry')).do(data => {
          this.setState({
            name: data,
          });
        })
      }
      handleClick = () => {
        this.props.dispatch({ type: 'changeName', payload: 'mary' });
      }
      render() {
        return (
          <div onClick={this.handleClick}>{this.state.name}</div>
        )
      }
    }
    const B$ = connect({
      connectScopes: {
        test: null,
      },
    })(B);

    const component_r = renderer.create(
      <Root$></Root$>
    );

    const component = renderer.create(
      <B$></B$>
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    tree.props.onClick();

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    component.unmount();
    component_r.unmount();
  })

  test('make a component link to multi scopes', () => {
    class Root2 extends React.Component<any, any> {
      handleClick = () => {
        this.props.handler && this.props.handler.call(this);
      }
      render() {
        return (
          <div onClick={this.handleClick}>{this.props.name}</div>
        )
      }
    }

    class B extends React.Component<any, any> {
      handleClick = () => {
        this.props.controllers['test'].dispatch({ type: 'changeName', payload: 'mary' });
      }
      render() {
        return (
          <div onClick={this.handleClick}>
            <span>{this.props.T_Name}</span>
            <span>{this.props.R2_Name}</span>
          </div>
        )
      }
    }

    const Root2$ = connect({
      scope: 'root2',
      initState: {
        name: 'jack',
        list: [],
      },
      reducer,
    })(Root2);

    const B$ = connect({
      connectScopes: {
        test: {
          propName: 'T_Name',
          path: 'name',
        },
        root2: {
          propName: 'R2_Name',
          path: 'name',
        },
      },
    })(B);

    const component_r1 = renderer.create(
      <Root$></Root$>
    );

    const component_r2 = renderer.create(
      <Root2$></Root2$>
    );

    const component = renderer.create(
      <B$></B$>
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    tree.props.onClick();

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    component.unmount();
    component_r1.unmount();
    component_r2.unmount();

  })

  test('unmount a component', () => {
    const A$ = connect({
      connectScopes: {
        test: 'name',
      },
    })(A);

    const component_r = renderer.create(
      <Root$></Root$>
    );

    const component = renderer.create(
      <A$></A$>
    );

    expect(RxStore.store.observers.length).toBe(2);

    component.unmount();

    expect(RxStore.store.observers.length).toBe(1);

  })

  test('get the ref of child component', () => {
    const A$ = connect({
      connectScopes: {
        test: 'name',
      },
      forwardRef: true,
    })(A);

    const childRef = React.createRef();
    function handler() {
      if (childRef.current) {
        this.props.dispatch({ type: 'changeName', payload: 'tom' });
      }
    }

    const component = renderer.create(
      <A$ handler={handler} ref={childRef}></A$>
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    tree.props.onClick();

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    component.unmount();
  })
})
