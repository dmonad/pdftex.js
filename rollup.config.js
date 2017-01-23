import uglify from 'rollup-plugin-uglify'
import babel from 'rollup-plugin-babel'

const plugins = [babel({
  exclude: 'node_modules/**'
})]

if (process.env.DEV == null) {
  plugins.push(uglify())
}

export default {
  moduleName: 'pdftex',
  entry: 'src/pdftex.js',
  format: 'umd',
  dest: 'pdftex.js',
  sourceMap: true,
  plugins: plugins
}
