const webpack = require('webpack');
const path = require('path');
const os = require('os');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const OptimizeCSSNanoPlugin = require('@intervolga/optimize-cssnano-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const DuplPkgCheckrPlugin = require('duplicate-package-checker-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
// const BabelPluginTransformImports = require('babel-plugin-transform-imports');
// const CompressionPlugin = require('compression-webpack-plugin');
// const VisualizerPlugin = require('webpack-visualizer-plugin');
const autoprefixer = require('autoprefixer');
// const cssnano = require('cssnano');
// const scssSyntax = require('postcss-scss');

process.traceDeprecation = true; // or run process with --trace-deprecation flag

const env = process.env.NODE_ENV || 'development';
const isProduction = env === 'production';
// const devMode = env !== 'production';

console.log('env: ', env);
console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);

module.exports = {
  mode: env,
  entry: {
    // polyfills: './src/config/polyfills.js',
    bundle: [
      // 'normalize.css/normalize.css',
      // 'sanitize.css/sanitize.css',
      // './src/styles/index.scss',
      './src/config/polyfills.js',
      './src/index.jsx',
    ],
  },
  output: {
    filename: isProduction ? 'js/[name].[chunkhash:4].js' : '[name].[id].js',
    chunkFilename: isProduction ? 'js/[name].[chunkhash:4].js' : '[id].js',
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
  },
  // ========================== OPTIMIZATION ==================================
  optimization: {
    minimizer: [ // setting this overrides webpack 4 defaults
      new UglifyJSPlugin({
        cache: true,
        parallel: os.cpus().length || 2, // "true": os.cpus().length - 1 (def)
        sourceMap: true, // set to true if you want JS source maps
      }),
      // use this or 'cssnano' or 'optimize-cssnano-plugin'
      new OptimizeCSSAssetsPlugin({}), // source maps are not created
    ],
    // ------------------------ SPLIT CHUNKS ----------------------------------
    splitChunks: {
      chunks: 'all', // to work for not only async chunks too
      // name: false, // switch off name generation
    },
    // splitChunks: {
    //   cacheGroups: {
    //     styles: { // to extract CSS into one file
    //       name: 'styles',
    //       test: /\.css$/,
    //       chunks: 'all',
    //       enforce: true
    //     }
    //   }
    // }
  },
  // =============================== PLUGINS ==================================
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: isProduction ? 'css/styles.[contenthash:4].css' : '[name].css',
      chunkFilename: isProduction ? 'css/[name].[contenthash:4].css' : '[id].css',
    }),
    // alternative to 'optimize-css-assets-webpack-plugin' or 'cssnano'
    // new OptimizeCSSNanoPlugin({ sourceMap: 'nextSourceMap' }),
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     NODE_ENV: JSON.stringify(env)
    //   },
    // }),
    new CleanWebpackPlugin(
      ['public'], // OR 'build' OR 'dist', removes folder
      { exclude: ['index.html'] },
    ),
    new HTMLWebpackPlugin({
      title: 'Local Chat',
      favicon: 'src/assets/favicon.png',
      // meta: {
      //   viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
      // },
      inject: false,
      template: './src/assets/template.html',
      appMountId: 'app',
      mobile: true,
    }),
    // new CompressionPlugin({
    //   deleteOriginalAssets: true,
    //   test: /\.js/
    // }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      // reportFilename: '../temp', // relative to output.path
      openAnalyzer: false,
    }),
    new CircularDependencyPlugin({
      exclude: /temp|node_modules/i, // exclude detection of files
      failOnError: true, // add errors to webpack instead of warnings
      // allow import cycles that include an asyncronous import, e.g. via
      allowAsyncCycles: false, // import(/* webpackMode: "weak" */ './file.js')
      cwd: process.cwd(), // for displaying module paths
    }),
    new DuplPkgCheckrPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // new VisualizerPlugin(),
    ...isProduction ? [] : [new webpack.HotModuleReplacementPlugin()],
  ],
  // =============================== RESOLVE ==================================
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      containers: path.resolve(__dirname, 'src/containers'),
      state: path.resolve(__dirname, 'src/state'),
      reducers: path.resolve(__dirname, 'src/reducers'),
      actions: path.resolve(__dirname, 'src/actions'),
      constants: path.resolve(__dirname, 'src/constants'),
      services: path.resolve(__dirname, 'src/services'),
      utils: path.resolve(__dirname, 'src/utils'),
    },
    modules: [
      // path.resolve(__dirname, 'src/components'),
      path.resolve(__dirname, 'src'),
      'node_modules',
    ],
    extensions: ['.js', '.json', '.jsx', '*'],
  },
  // ============================ MODULE (lOADERS) ============================
  module: {
    rules: [
      // -------------------- JS/JSX BABEL-LOADER -----------------------------
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname, 'src')],
        exclude: [path.resolve(__dirname, 'node_modules')],
        // TODO: use .babelrc instead ?
        options: {
          // ------------------------ BABEL PLUGINS ---------------------------
          // TODO: "transform-imports" (babel-plugin-transform-imports)
          plugins: [
            'react-hot-loader/babel',
            // 'fast-async',
            'syntax-dynamic-import',
            'transform-class-properties',
          // TODO: replace next concat by by .filter(Boolean)
          ].concat(isProduction ? [] : ['transform-react-jsx-source']),
          // ------------------------ BABEL PRESETS ---------------------------
          presets: [
            ['env', {
              // need to be turned on for Jest testing
              // modules: env === 'development' ? false : 'commonjs',
              useBuiltIns: 'usage', // 'entry' OR false
              debug: true,
              targets: {
                browsers: [
                  'last 2 versions',
                  'Safari >= 10',
                  'iOS >= 10',
                  'not ie <= 10',
                  '> 1%',
                ],
              },
              exclude: [/* plugins to exlude */],
            }],
            // 'flow',
            'react',
            'stage-3',
          ],
          cacheDirectory: true,
        },
      },
      // --------------------- CSS/SCSS LOADERS -------------------------------
      {
        test: /\.(scss|css)$/, // OR /\.s?[ac]ss$/, OR /\.(sa|sc|c)ss$/,
        include: [
          // path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'src/styles'),
          path.resolve(__dirname, 'src/components'),
          path.resolve(__dirname, 'node_modules'),
        ],
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          { // not translates url() that starts with "/"
            loader: 'css-loader',
            // options: { importLoaders: 3, url: false }
            options: { sourceMap: true },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              // syntax: scssSyntax,
              plugins: isProduction ? [autoprefixer/* , cssnano */] : [],
              sourceMap: true,
            },
          },
          // 'resolve-url-loader',
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        // TODO: consider to remove include
        include: path.resolve(__dirname, 'src'),
        use: [
          // --------------------- FILE-LOADER --------------------------------
          {
            loader: 'file-loader',
            options: {
              name: isProduction ? '[name].[hash:4].[ext]' : '[name].[ext]',
              // outputPath: 'assets/', // custom output path
              useRelativePath: true, // isProd
            },
          },
          // --------------------- IMAGE-WEBPACK-LOADER -----------------------
          // {
          //   loader: 'image-webpack-loader',
          //   query: {
          //     progressive: true,
          //     optimizationLevel: 7,
          //     interlaced: false,
          //     pngquant: {
          //       quality: '65-90',
          //       speed: 4
          //     }
          //   }
          // }
        ],
      },
      // --------------------------- URL-LOADER -------------------------------
      // {
      //   test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/,
      //   loader: 'url-loader',
      //   options: {
      //     limit: 10000,
      //   },
      // },
    ],
  },
  // ============================= DEV-SERVER =================================
  devServer: {
    progress: true,
    contentBase: path.resolve(__dirname, 'public'),
    compress: true,
    historyApiFallback: true,
    hot: true,
    // port: 9000,
  },
  devtool: isProduction ? 'source-map' : 'eval-source-map',
};
