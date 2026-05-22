require("dotenv").config();

const app = require("./app");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 8083;

sequelize
  .sync({ alter: false })
  .then(() => {
    console.log("DB connected and synced");

    app.listen(PORT, () => {
      console.log(`challenge-svc listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection or sync failed");
    console.error(err);
    process.exit(1);
  });