import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/rimx.js',
    format: 'umd',
    name: 'rimx',
  },
  plugins: [
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules',
        jsnext: true,
        main: true,
      },
    }),
    typescript({
      tsconfig: 'tsconfig.json',
      rollupCommonJSResolveHack: true,
    }),
    commonjs({
      include: 'node_modules/**',  // Default: undefined
      // search for files other than .js files (must already
      // be transpiled by a previous plugin!)
      extensions: [ '.js' ],  // Default: [ '.js' ]
 
      // if true then uses of `global` won't be dealt with by this plugin
      ignoreGlobal: false,  // Default: false
 
      // if false then skip sourceMap generation for CommonJS modules
      sourceMap: false,  // Default: true
    }),
  ],
  external: id => /^(react|immutable|rxjs)/.test(id)
}
