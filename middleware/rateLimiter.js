// middleware/rateLimiter.js
const { RateLimiterRedis } = require('rate-limiter-flexible');
const redisClient = require('../utils/redisClient'); 

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rate',
  points: 5,              
  duration: 60,            
  blockDuration: 1800,    
});

const rateLimiterMiddleware = (req, res, next) => {
  const key = req.ip;

  limiter.consume(key)
    .then(() => {
      next(); 
    })
    .catch((rejRes) => {
      if (rejRes.msBeforeNext > 0) {
        res.set('Retry-After', Math.ceil(rejRes.msBeforeNext / 1000));
      }
      res.status(429).json({
        error: 'Too many requests. Try again later.',
        retryAfterSeconds: Math.ceil(rejRes.msBeforeNext / 1000),
      });
    });
};

module.exports = rateLimiterMiddleware;
