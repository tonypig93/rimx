# `RimX`
[![Build Status](https://www.travis-ci.org/tonypig93/rimx.svg?branch=master)](https://www.travis-ci.org/tonypig93/rimx)

A state management tool for React, based on RxJS and ImmutableJS.

`RimX`是一个类似`redux`的状态管理工具，不同的是`RimX`没有`action` `reducer`等概念，使用起来较为简单。你可以利用`RxJS`强大的流处理能力来管理`react`组件的状态变化，另一方面`ImmutableJS`可以在最大限度上保证状态之间的独立性，防止因某一状态改变时引起其他不相干组件的更新。
`RimX`本身是个小巧的库，`gzip`后仅3KB。`RimX`虽然运行在`react`之上，但是其底层结构完全可以被用于其他框架当中。

# 依赖
- `RxJS` >= 5.5.0
-  `ImmutableJS` >= 3.8.0

需要用户自行安装以上两个库。

# 安装
```
npm i rimx --save
```
或者
```
yarn add rimx
```

# 基础概念
`RimX`会创建一个全局唯一的`store`，所有的状态都存储在`store`中。为保证模块之间的独立性，你需要在`store`中创建不同的域`scope`，然后需要用到该`scope`的组件就可以通过`connect`连接到该`scope`，获得`scope`中状态的实时响应。你既可以将`scope`的状态注入到`props`中，也可以手动订阅某个状态，利用`RxJS`操作符实现更复杂的逻辑。


### API
**`connect(options)(Component)`**

类似于`redux`，`rimx`提供一个`connect`函数用于将组件加入状态管理当中。

```
connect({
  scopeName: string;
  initState: any,
  connectScopes?: {
    [scopeName: string]: any,
  };
  reducer?: Reducer;
  cache?: boolean;
  log?: boolean;
})(MyComponent)
```

属性|说明|默认值
|:----:|:----|:----:|
|`scopeName`|`rimx`中的状态都在一个`store`当中，但是你可以将其划分为多个`scope`，举例来说一个业务模块中的多个组件可以属于同一个`scope`，`scope`之间不共享`state`与`reducer`。| --|
|`initState`|指定`scopeName`时表示创建`scope`，然后就需要提供初始状态，这里需要注意的是，`initState`会被转换为`Immutable`结构，例如`{ list: [] }`中的`list`会被转成`Immutable.List`，如果你希望`list`是原生数组，那么需要用`Immutable.Map({ list: [] })`包装起来。|`{}`|
|`connectScopes`|创建了`scope`之后，其他组件需要连接到这个`scope`当中才能获取或者修改`scope state`，传入`connectScopes`的是一个对象，`key`表示需要连接到的`scope`， `value`有多种形式，后面有举例。|--|
|`reducer`|类似于`redux`的`reducer`，写法基本相同。|--|
|`cache`|是否缓存当前`scope`的`state`，当`scope`被重新创建时会读取上一次的`state`|`false`|
|`log`|是否在状态变化时打印日志，可以用于排查问题。|`false`|

### 基本用法
```
import React from 'react';
import { connect } from 'rimx';

class A extends React.Component {
  ...
}
const STATE = {
  profile: {
    name: 'tony',
    age: 18,
  },
  role: 'admin',
};

export connect({
  scopeName: 'global',
  initState: STATE,
})
```
上面的代码创建了一个名为`global`的`scope`，然后我们在另一个组件中访问这个`scope`。
```
import React from 'react';
import { connect } from 'rimx';

class B extends React.Component {
  render() {
    return (
      <div>{this.props.profile.name}</div> //此时可以在props中获取scope state
    );
  }
}

export connect({
  connectScopes: {
    global: 'profile',
  },
});

```

> `connectScopes`有多种写法，上面是简写，仅当`propName`与`path`相同时可以简写，其他写法如下：

```
connectScopes: {
  global: [{
    propName: 'age',
    path: ['profile', 'age'],
  }],
}

connectScopes: {
  global: {
    propName: 'age',
    path: ['profile', 'age'],
  },
}

connectScopes: {
  global: {
    propName: 'age',
    path: 'profile.age',
  },
}

```

如果要修改`state`，有两种方法，一种是直接在`scope`的控制对象`subject`上修改，另一种是用`reducer`。
```
// 直接修改
import React from 'react';
import { connect } from 'rimx';

class B extends React.Component {
  handleChangeState = () => {
    this.props.subject.next(() => ({
      profile: {
        age: 20,
      },
    }));
  }
  render() {
    return (
      <div onClick={this.handleChangeState}>{this.props.profile.name}</div> //此时可以在props中获取scope state
    );
  }
}

export connect({
  connectScopes: {
    global: 'profile',
  },
});
```

每个被`connect`包裹后的组件都会获得一个`subject`对象，这个对象包含了对`scope`的全部操作。

> 当`connect`的参数里只有`scopeName`，或者`connectScopes`只有连接了一个`scope`时，或者`connectScopes`只连接了一个`scope`并且该`scope`与`scopeName`相同时，`this.props.subject`指向`scope subject`本身，如果连接到了多个`scope`，需要提供`scopeName`来获取`scope subject`，例如`this.props.subject['global']`。

`subject`本身是一个`RxJS Subject`对象，但是重载了`next`和`subscribe`这两个方法，其包含的数据为`scope state`：
- **`subject.next()`**
  `subject.next()`可以直接传入一个新的`state`，或者传入一个函数，函数的参数为当前`state`。调用`next`之后可以同步修改`state`。
- **`subject.listen()`**
  `listen`接收一个路径，表示监听该路径指向数据的变化，`listen`要和`do`一起搭配使用，变化之后的数据会传入`do`。`listen`可以用于获取`state`中的任何数据，而不局限于`props`中提供的，不传入参数表示监听整个`state`。
- **`subject.listen().do()`**
  `do`接收一个`observer`，用于响应数据变化，当`state`发生变化时会触发`do`的回调。

  ```
  import React from 'react';
  import { connect } from 'rimx';

  class B extends React.Component {
    componentDidMount() {
      this.props.subject.listen(['profile', 'age']).do(data => {
        console.log(data); // 18 -> 20;
        // 首次监听时会获取`profile.age`的初始值18，之后当触发`handleChangeState`时，会获得新值20。
        // 其他字段例如profile.name的变化不会触发这里的回调。
      });
    }
    handleChangeState = () => {
      this.props.subject.next(() => ({
        profile: {
          age: 20,
        },
      }));
    }
    render() {
      return (
        <div onClick={this.handleChangeState}>{this.props.profile.name}</div>
      );
    }
  }

  export connect({
    connectScopes: {
      global: 'profile',
    },
  });
  ```

- **`subject.listen().pipe().do()`**
  `pipe`用于对数据流进行提前处理，可以接入任何`rxjs`的操作符，例如过滤低于20的值，只有当`age`大于20时才会响应回调。

  ```
  import React from 'react';
  import { connect } from 'rimx';

  class B extends React.Component {
    componentDidMount() {
      this.props.subject
        .listen(['profile', 'age'])
        .pipe(ob => ob.filter(v => v 20))
        .do(data => {
          console.log(data); // 21;
          // 第三次点击时才会触发回调。
        });
    }
    handleChangeState = () => {
      const nextAge = state.getIn(['profile', 'age']) + 1;
      this.props.subject.next(() => ({
        profile: {
          age: nextAge,
        },
      }));
    }
    render() {
      return (
        <div onClick={this.handleChangeState}>{this.props.profile.name}</div>
      );
    }
  }

  export connect({
    connectScopes: {
      global: 'profile',
    },
  });
  ```

- **`subject.dispatch()`**
  用于执行`reducer`，接收一个`action`作为参数，第二个参数用于在`merge`和`update`之间选择状态的更新方式。

> 为了简化使用，当`subject`指向`scope subject`时，会将`listen`和`dispatch`直接注入`props`。

不仅仅是`B`组件，`A`组件也可以完成上面的全部操作，只需像`B`一样配置`connectScopes`。

```
import React from 'react';
import { connect } from 'rimx';

class A extends React.Component {
  componentDidMount() {
    this.props.listen(['profile', 'age']).do(data => {
      console.log(data); // 18 -> 20;
    });
  }
  handleChangeState = () => {
    this.props.subject.next(() => ({
      profile: {
        age: 20,
      },
    }));
  }
  render() {
    return (
      <div onClick={this.handleChangeState}>{this.props.profile.name}</div>
    );
  }
}
const STATE = {
  profile: {
    name: 'tony',
    age: 18,
  },
};

export connect({
  scopeName: 'global',
  initState: STATE,
  connectScopes: {
    global: 'profile',
  },
})
```

### 如何使用`reducer`
基本用法：

```
// constants.js
export const CHANGE_AGE = 'CHANGE_AGE';
```

```
// actions.js
import { CHANGE_AGE } from './constants';
export function changeAge(age) {
  return {
    type: CHANGE_AGE,
    payload: age,
  };
}
```

```
// reducer.js
import { combineReducers } from 'rimx';
import { CHANGE_AGE } from './constants';

function changeAge(state, action) {
  return {
    profile: {
      age: action.payload,
    },
  };
}

const reducers = combineReducers({
  [CHANGE_AGE]: changeAge,
});

export default reducers;
// combineReducers用于将`action type`和`reducer`绑定在一起。
```

```
import React from 'react';
import { connect } from 'rimx';
import reducer from './reducer';
import { changeAge } from './actions';

class A extends React.Component {
  handleChangeState = () => {
    this.props.dispatch(changeAge(20));
  }
  render() {
    return (
      <div onClick={this.handleChangeState}>{this.props.profile.name}</div>
    );
  }
}
const STATE = {
  profile: {
    name: 'tony',
    age: 18,
  },
};

export connect({
  scopeName: 'global',
  initState: STATE,
  reducer,
})
```

以上代码只要用过`redux`基本都看得懂，这里需要特别指出的是关于`reducer`的返回值。默认情况下，`rimx`使用`ImmutableJS`的`mergeDeepIn`来合并前后两个状态，因此修改一个基本类型的值时，只需提供包含修改部分的对象（或者是`Immutable`结构）即可。

```
// 修改前
state = {
  profile: {
    name: 'tony',
    age: 18,
  },
  role: 'admin',
};

↓

reducer(state, action) {
  return {
    profile: {
      age: action.payload,
    },
  };
  或者
  return Immutable.fromJS({
    profile: {
      age: action.payload,
    },
  });
  但是不能这样
  return Immutable.Map({
    profile: {
      age: action.payload,
    },
  });
  下面这种在merge策略下尽量不要这么做，因为一方面会提高合并成本，另一方面会导致异步reducer之后状态发生异常。
  return state.setIn(['profile', 'age']);
}

↓
// 修改后
state = {
  profile: {
    name: 'tony',
    age: 20,
  },
  role: 'admin',
};

```

为什么说上面只能用`Immutable.fromJS`而不能用`Immutable.Map`呢？因为不论是返回原生对象还是`Immutable.fromJS`，最终结果都是被转换为完完全全的`Immutable`结构，但是`Immutable.Map`只会转换第一层，也就是说`profile`不是`Immutable`的，当调用`profile.get('age')`时就会报错，因为`profile`是原生的对象。
那么什么情况下应该使用`Immutable.Map`呢，例如前面说过，想要在某个字段上创建一个原生的数组或者对象时，需要用`Immutable.Map`包裹起来，道理同上，此时为了修改状态后的字段依然为原生，就需要在`reducer`里将返回值用`Immutable.Map`包裹起来。
`merge`策略会导致一个问题，就是`Immutable.List`对象会合并，例如：

```
export connect({
  scopeName: 'global',
  initState: {
    list: [],
  },
  reducer,
})
```

此时`list`被转换为`Immutable.List`，当重新发起`http`请求来获取最新的`list`数据时，前后`list`会被合并，旧数据被保留了下来。此时有两种解决办法，一是用原生数组保存`list`：

```
export connect({
  scopeName: 'global',
  initState: Immutable.Map({
    list: [],
  }),
  reducer,
})
```

二是改用`update`策略，将`dispatch()`的第二个参数设置为`false`可以切换到`update`，新的`state`会替换旧的`state`：

```
this.props.dispatch(loadData(), false);
```

此时`reducer`需要用到`state`这个参数来返回新的`state`，不然就丢失了其他字段。

```
loadData(state, action) {
  return state.set('list', Immutable.List(action.payload));
}
```

### 异步`reducer`
利用`rxjs`可以轻松实现异步`reducer`，基本用法如下：

```
// reducer.js
import DataService from 'data.service';

function loadRole(state, action) {
  return DataService.getData(action.payload).map(data => ({
    role: data.role,
  }));
}
```

`DataService.getData`返回了一个用`Observable`包装后的`Http`请求，然后使用`map`操作符返回需要修改的`state`。

> 只要返回值是`Observable`，`rimx`就可以从中获取数据。某个库只有`Promise`？可以用`Observable.fromPromise(promise)`来将`Promise`转换为`Observable`。

一个稍微复杂点的例子：

```
// reducer.js
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/merge';
import DataService from 'data.service';

function loadRole(state, action) {
  return Observable.of({
    loading: true,
  }).merge(
    DataService.getData(action.payload).map(data => ({
      role: data.role,
      loading: false,
    }))
  );
}
```

上面实现的是发起`Http`请求之前将`loading`设为`true`，完成后再设为`false`，这个`reducer`首先会返回一个`{ loading: true }`的状态，完成`Http`请求之后再返回另一个`{ loading: false, role: data.role }`的状态，因此会触发目标组件的两次渲染。
