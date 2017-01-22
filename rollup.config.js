import uglify from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'

export default {
  moduleName: 'pdftex',
  entry: 'src/pdftex.js',
  format: 'umd',
  dest: 'pdftex.js',
  sourceMap: true,
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    uglify()
  ]
}
