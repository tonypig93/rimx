const webpack = require("webpack");

module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: "rimx.js",
    path: __dirname + "/dist",
    library: 'RimX',
    libraryTarget: "commonjs2"
  },
  externals: [
    {
      react: {
        commonjs2: "react",
      },
      immutable: {
        commonjs2: "immutable",
      }
    },
    "rxjs/BehaviorSubject",
    "rxjs/Subject",
    "rxjs/Observable",
    "rxjs/add/operator/distinctUntilChanged",
    "rxjs/add/operator/map",
  ],
  optimization: {
    minimize: false,
  },
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
