const Redis = require('ioredis');
require('dotenv').config();
const redisConfig = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    username: 'default',
    password: process.env.REDIS_PASSWORD,
  }
  console.log('Connecting to Redis with config:', redisConfig);
const redis = new Redis(redisConfig);

  redis.on('connect', () => {
    console.log('Redis connected');
  });
  

  redis.on('error', (err) => {
    console.error(' Redis connection error:', err.message);
  });
  

  redis.on('reconnecting', () => {
    console.warn(' Redis reconnecting...');
  });
  

  redis.on('end', () => {
    console.warn('Redis connection closed');
  });

module.exports = redis;
