const createClient = require("redis");

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

const redis = createClient({
  socket: {
    host: process.env.REDIS_HOSTNAME || "redis",
    port: redisPort,
  },
});

redis.connect().catch(console.error);

module.exports = redis;