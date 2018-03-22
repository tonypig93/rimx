# `RimX`
A state management tool for React, based on RxJS and ImmutableJS.

`RimX`是一个类似`redux`的状态管理工具，不同的是`RimX`没有`action` `reducer`等概念，使用起来较为简单。你可以利用`RxJS`强大的流处理能力来管理`react`组件的状态变化，另一方面`ImmutableJS`可以在最大限度上保证状态之间的独立性，防止因某一状态改变时引起其他不相干组件的更新。
`RimX`本身是个小巧的库，`gzip`后仅3KB。`RimX`虽然运行在`react`之上，但是其底层结构完全可以被用于其他框架当中。

# 依赖
- `RxJS` >= 5.5.0
-  `ImmutableJS` >= 3.8.0

需要用户自行安装以上两个库。

# 基础概念
`RimX`会创建一个全局唯一的`store`，所有的状态都存储在`store`中。为保证模块之间的独立性，你需要在`store`中创建不同的域`scope`，然后需要用到该`scope`的组件就可以通过`connect`连接到该`scope`，获得`scope`中状态的实时响应。你既可以将`scope`的状态注入到`props`中，也可以手动订阅某个状态，利用`RxJS`操作符实现更复杂的逻辑。


# API

## connect(scopeName, initState?, connectScopes?)
与`redux`相似，`connect`可以将你的组件与`store`进行连接，连接方式有两种：成为宿主组件或连接组件。

## 宿主组件
使用方法：
```
import React from 'react';
import { connect } from 'rimx';

class OrderPage extends React.Component { ... }

export default connect('order', {
  list: [],
})(OrderList)
```
上面表示你将`OrderPage`作为宿主组件，并在上面创建了一个名为order的`scope`，然后设定了该`scope`的初始状态。

> 注意，传入的初始状态会转为`immutable`结构，解析时需要按照`ImmutableJS`的格式进行解析。

## 连接组件
使用方法：
```
class OrderList extends React.Component { ... }

export default connect({
  order: null,
})(OrderList)
```
当你传递给`connect`的第一个参数为对象时，该组件自动成为连接组件，并连接到order这个`scope`，此时你可以选择`scope`中一个或多个状态进行响应，有两种方法可以订阅状态：

 ### `mapStateToProps`
 将`scope`中的状态注入到组件的`props`当中，用法如下：
 ```
 export default connect({
   order: {
     propName: 'list',
     path: 'list',
   },
 })(OrderList)

 //可简写为
  export default connect({
   order: 'list',
 })(OrderList)
 ```
 `propName`表示要映射到组件的`prop`名称，`path`表示`scope`中状态的路径，如果路径超过一层，可以传入数组
 > `path`参考`ImmutableJS`的`getIn`。
 
 ```
 //假设scope的状态如下
 {
  data: {
    list: [],
    username: 'tony zhu',
  },
 }
 
 //connect写法
  export default connect({
   order: {
     propName: 'list',
     path: ['data', 'list'],
   },
 })(OrderList)

 //多个prop
   export default connect({
   order: [{
     propName: 'list',
     path: ['data', 'list'],
   }, {
     propName: 'userName',
     path: ['data', 'username']
   }],
 })(OrderList)
 ```
 其中仅订阅了`list`的`OrderList`组件将只会响应`list`的变化，而不受其他状态变化的影响。
 
 ### `listen(observer, path?, mapper?)`
 `listen`是手动订阅状态的方法。连接到`store`的组件都会获得一个名为`subject`的`prop`，`subject`其实就是对某个`scope`进行状态管理的核心实例，本质上来说`mapStateToProps`也是调用`subject`的`listen`方法。
 
 `observer`对应`RxJS`的`observer`，包含完整的`next` `error` `complete`方法；`path`表示状态路径；`mapper`表示对状态序列的处理，即添加操作符。
 
 用法
 ```
class OrderList extends React.Component {
  state = {
    data: [],
  }
  componentDidMount() {
    this.props.subject.listen((data) => {
       this.setState({
        data,
       });
    }, ['list'])
  }
}
export default connect({
  order: null,
})(OrderList)
 ```

 > 尽管`listen`会返回`subscription`，但是你不需要手动调用`unsubscribe`，`listen`订阅的事件会随着组件销毁而销毁。
 
 `mapper`可以使用任何`RxJS`的操作符对状态流进行预处理。
 ```
 componentDidMount() {
  this.props.subject.listen((data) => {
     this.setState({
      data,
     });
  }, ['list'], (ob) => ob.filter((list) => list.size > 5));
}
 ```

## 宿主组件如何获得状态`props`
这时可以用到`connect`的第三个参数，用法如下
```
export default connect('order', {
  list: [],
}, {
  order: 'list',
})(OrderList)

//也可以手动listen
```

## `subject`
上面说过连接到`store`的组件都会获得`subject`，`subject`除了可以手动订阅状态之外，还有一个最重要的功能，就是改变状态。
```
class OrderList extends React.Component {
  handleClick = () => {
    this.props.subject['order'].next((data) => data.set('username', 'Daddy'));
    // 连接组件需要通过指定`scope`来获取对应的`subject`，纯宿主组件可以直接使用`subject`
  }
  render() {
    return (
      <div>
        <p>user name: {this.props.username}</p>
        <button onClick={this.handleClick}>click me</button>
      </div>
    )
  }
}
export default connect({
  order: 'username',
})(OrderList)
```

改变状态就需要调用`subject`的`next`方法，`next`接收一个函数，函数内获得的参数`data`为整个`scope`的状态（`Immutable`结构），返回值将作为下一个`scope`的状态。当你改变状态后发现组件无法获取到该状态，请检查`next`中是否正确返回了完整`Immutable`结构的数据。
> 需要保证传入`next`的函数为纯函数，以免引起`side effect`。另外下个版本可能会将`next`注入到`props`中方便使用。

...持续更新中