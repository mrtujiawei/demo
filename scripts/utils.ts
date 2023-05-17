import { config } from 'dotenv';

export const loadEnv = () => {
  config({ override: false });
};

export const checkEnv = () => {
  if (!process.env.demo) {
    console.log('Please create .env file and add demo=[demo] first');
    process.exit(1);
  }
};
