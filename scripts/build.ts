import webpack from 'webpack';
import { checkEnv, loadEnv } from './utils';
import getConfig from './webpack.config';

loadEnv();
checkEnv();

const config = getConfig('production', process.env.demo!);

const compiler = webpack(config);
compiler.run((_err, result) => {
  console.log(_err || result?.toString());
  compiler.close((err) => {
    if (err) {
      console.log(err);
    }
  });
});
