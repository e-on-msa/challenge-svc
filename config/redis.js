const Redis = require("ioredis");

const redisPort = parseInt(process.env.REDIS_PORT ?? "6379", 10);

if (
  !Number.isInteger(redisPort) ||
  redisPort < 1 ||
  redisPort > 65535
) {
  throw new Error(
    "Invalid REDIS_PORT. Expected integer between 1 and 65535."
  );
}

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: redisPort,
});

module.exports = redis;