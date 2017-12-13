module.exports = {
  entry: './src/index',
  output: {
    filename: 'dist/react-jquery-datatables.min.js',
    library: 'ReactJqueryDatatables',
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
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
      },
    ],
  },
};
