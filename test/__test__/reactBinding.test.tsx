import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { connect } from '../../src/reactBinding';
import { combineReducers } from '../../src/base/combineReducers';

let Root$;

class Root extends React.Component<any, any> {
  handleChangeState = () => {
    this.props.dispatch({ type: 'changeName', payload: 'tom' });
  }
  render() {
    return (
      <div onClick={this.handleChangeState}>{this.props.name}</div>
    )
  }
}

class Another extends React.Component<any, any> {
  render() {
    return (
      <div>{this.props.name}</div>
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

function reducer1() {
  return {
    name: 'tom',
  };
}

const reducer = combineReducers({
  changeName: reducer1,
});

describe('React bindings', () => {
  test('create a scope with a component', () => {
    expect(Root$.name).toBe('ConnectedComponent');

    const component = renderer.create(
      <Root$></Root$>
    );

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    tree.props.onClick();

    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })

  test('make a component link to the scope', () => {
    const Another$ = connect({
      connectScopes: {
        test: 'name',
      },
    })(Another);

    const component_r = renderer.create(
      <Root$></Root$>
    );

    const component_a = renderer.create(
      <Another$></Another$>
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
})
