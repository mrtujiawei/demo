/**
 * 提供最基础的模板
 * 经过修改后才能使用
 *
 * 主要是要添加
 *
 * entry
 * output.path
 *
 * @filename: scripts/webpack.config.ts
 * @author: Mr Prince
 * @date: 2022-11-02 15:05:44
 */
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import path from 'path';

type Rules = webpack.RuleSetUseItem[];

const getStyleLoaders = (...loaders: Rules): Rules => {
  return [
    {
      loader: MiniCssExtractPlugin.loader,
    },
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          config: false,
          plugins: ['postcss-preset-env'],
        },
      },
    },
    ...loaders,
  ];
};

/**
 * bytes
 * 5M
 */
const WARN_FILE_SIZE = 5 * 1024 * 1024;

const getConfig = (mode: webpack.Configuration['mode'], demo: string) => {
  const isEnvProduction = 'production' == mode;

  const config: webpack.Configuration = {
    mode,

    entry: path.resolve(process.cwd(), 'packages', demo, 'src/index'),
    output: {
      path: isEnvProduction
        ? path.resolve(process.cwd(), 'dist', demo)
        : path.resolve(process.cwd(), demo),
      publicPath: isEnvProduction ? `/${demo}` : '/',
      filename: 'js/[name].[contenthash:9].js',
      chunkFilename: 'js/[contenthash:9].js',
    },

    // 有错尽快结束
    bail: isEnvProduction,

    // sourcemap配置
    devtool: !isEnvProduction && 'source-map',

    // 有警告或错误才显示
    stats: 'errors-warnings',
    module: {
      // 将缺失的导出提示成错误而不是警告
      strictExportPresence: true,
      rules: [
        {
          oneOf: [
            {
              test: /\.(ts|js)x?$/,
              exclude: /(node_modules)/,
              use: {
                loader: 'babel-loader',
                options: {
                  sourceMaps: !isEnvProduction,
                  inputSourceMap: !isEnvProduction,
                  cacheDirectory: true,
                  cacheCompression: false,
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        useBuiltIns: 'usage',
                        corejs: '3.19.1',
                      },
                    ],
                    // [
                    //   '@babel/preset-react',
                    //   {
                    //     runtime: 'automatic',
                    //   },
                    // ],
                    '@babel/preset-typescript',
                  ],
                  plugins: [
                    [
                      '@babel/plugin-transform-runtime',
                      {
                        proposals: true,
                      },
                    ],
                  ],
                },
              },
            },
            {
              test: /\.css$/,
              use: getStyleLoaders(),
            },
            {
              test: /\.less$/,
              use: getStyleLoaders({
                loader: 'less-loader',
                options: {
                  lessOptions: {
                    javascriptEnabled: true,
                  },
                  sourceMap: true,
                },
              }),
            },
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:9].css',
      }),
      new HTMLWebpackPlugin({
        template: path.resolve(process.cwd(), 'public/index.html'),
      }),
    ],
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue', '.json'],
    },
    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        new TerserWebpackPlugin({
          // 注释不单独生成一个文件
          extractComments: false,
          terserOptions: {
            compress: {
              // webpack 默认 配置为2
              // 没必要压缩两遍
              passes: 1,
            },
            mangle: {
              safari10: true,
            },
            output: {
              // 不生成特殊的注释
              comments: false,
            },
          },
        }),
        new CssMinimizerPlugin(),
      ],
      splitChunks: {
        minSize: 500,
        minChunks: 1,
        cacheGroups: {
          vendors: {
            name: 'vendors',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
          },
        },
      },
    },
    performance: {
      maxEntrypointSize: WARN_FILE_SIZE,
      maxAssetSize: WARN_FILE_SIZE,
    },
  };

  return config;
};

export default getConfig;
