module.exports = {
  entry: './src/index',
  output: {
    filename: 'dist/react-jquery-datatables-components.min.js',
    library: 'ReactDataComponents',
    libraryTarget: 'umd',
  },
  externals: {
    'react': {
      root: 'React',
      amd: 'react',
      commonjs: 'react',
      commonjs2: 'react',
    },
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader' },
    ],
  },
};
