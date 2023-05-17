import { config } from 'dotenv';
import path from 'path';

/**
 * 加载环境
 */
export const loadEnv = () => {
  config({ override: false });
};

/**
 * 检查环境加载是否成功
 */
export const checkEnv = () => {
  if (!process.env.demo) {
    console.log('Please create .env file and add demo=[demo] first');
    process.exit(1);
  }
};

/**
 * 相对项目根目录的绝对路径
 */
export const projectPath = (...paths: string[]) => {
  return path.resolve(process.cwd(), ...paths);
};
