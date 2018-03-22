const webpack = require("webpack");

module.exports = {
  entry: "./src/index.tsx",
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
    "rxjs/add/operator/distinctUntilChanged",
    "rxjs/add/operator/map",
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: "ts-loader",
        options: {
          compilerOptions: {
            module: 'es2015'
          }
        }
      }
    ]
  },
  resolve: {
    modules: ["node_modules"],
    extensions: [
      '.web.ts',
      '.ts',
      '.web.tsx',
      '.tsx',
      '.web.js',
      '.js',
      '.json',
      '.web.jsx',
      '.jsx',
    ],
  },
  plugins: [
  ]
};
