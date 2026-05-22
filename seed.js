require("dotenv").config();

const { sequelize } = require("./models");

const seedInterestCategory = require("./seeders/interestCategorySeeder");
const seedInterests = require("./seeders/interestSeeder");
const seedVisionCategory = require("./seeders/visionCategorySeeder");
const seedVisions = require("./seeders/visionSeeder");

(async () => {
  try {
    await sequelize.authenticate();

    await seedInterestCategory();
    await seedInterests();

    await seedVisionCategory();
    await seedVisions();

    console.log("Seed completed");

    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();