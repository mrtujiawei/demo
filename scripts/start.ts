import { checkEnv, loadEnv } from './utils';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import getConfig from './webpack.config';

loadEnv();
checkEnv();

const config = getConfig('development', process.env.demo!);

new WebpackDevServer(
  {
    compress: false,
    historyApiFallback: true,
    static: {
      directory: path.resolve(process.cwd(), 'public'),
      serveIndex: true,
    },
  },
  webpack(config)
).start();
