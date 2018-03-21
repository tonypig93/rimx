const webpack = require("webpack");
module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "rimx.js",
    path: __dirname + "/dist",
    library: 'RimX',
    libraryTarget: "umd"
  },
  externals: [
    {
      react: {
        commonjs: "react",
        commonjs2: "react",
        amd: "react"
      },
      immutable: {
        commonjs: "immutable",
        commonjs2: "immutable",
        amd: "immutable"
      }
    },
    "rxjs/BehaviorSubject",
    "rxjs/Subject",
    "rxjs/add/operator/pluck",
    "rxjs/add/operator/distinctUntilChanged",
    "rxjs/add/operator/map",
    "rxjs/add/operator/finally",
    "rxjs/add/operator/takeUntil"
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
      }
    ]
  },
  resolve: {
    modules: ["node_modules"]
  },
  plugins: [
  ]
};
