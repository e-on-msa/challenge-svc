require("dotenv").config();

const app = require("./app");
const { sequelize } = require("./models");
const { startUserEventConsumer } = require("./queues/userEventConsumer");

const PORT = process.env.PORT || 8083;

sequelize
  .sync({ alter: false })
  .then(async () => {
    console.log("DB connected and synced");

    app.listen(PORT, async () => {
      console.log(`challenge-svc listening on ${PORT}`);

      try {
        await startUserEventConsumer();

        console.log("RabbitMQ consumer started");
      } catch (err) {
        console.error(
          "RabbitMQ consumer start failed:",
          err
        );
        process.exit(1);
      }
    });
  })
  .catch((err) => {
    console.error("DB connection or sync failed:", err);
    process.exit(1);
  });