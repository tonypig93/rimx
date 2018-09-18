import * as React from 'react';
import * as renderer from 'react-test-renderer';
import 'rxjs/add/operator/mapTo';
import { connect } from '../../src/reactBinding';
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

const reducer = combineReducers({
  changeName: reducer1,
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

  })
})
