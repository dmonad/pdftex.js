import uglify from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'

export default {
  entry: 'src/pdftex-worker.js',
  format: 'umd',
  dest: 'pdftex-worker.js',
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    uglify()
  ]
}
