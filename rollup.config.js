import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/rimx.js',
    format: 'es',
    name: 'rimx',
  },
  plugins: [
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      },
    }),
    typescript({
      tsconfig: 'tsconfig.json',
    }),
  ],
  external: id => /(react|immutable|rxjs)/.test(id)
}
