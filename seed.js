require("dotenv").config();

const { sequelize } = require("./models");

const seedInterestCategory = require("./seeders/interestCategorySeeder");
const seedInterests = require("./seeders/interestSeeder");
const seedVisionCategory = require("./seeders/visionCategorySeeder");
const seedVisions = require("./seeders/visionSeeder");
const seedChallenges = require("./seeders/challengeSeeder");
const seedAttachments = require("./seeders/attachmentSeeder");
const seedBookmarks = require("./seeders/bookmarkSeeder");
const seedChallengeDays = require("./seeders/challengeDaySeeder");
const seedChallengeInterests = require("./seeders/challengeInterestSeeder");
const seedChallengeVisions = require("./seeders/challengeVisionSeeder");
const seedParticipatingChallenges = require("./seeders/participatingChallengeSeeder");
const seedParticipatingAttendances = require("./seeders/participatingAttendanceSeeder");
const seedReviews = require("./seeders/reviewSeeder");

(async () => {
  try {
    await sequelize.authenticate();

    await seedInterestCategory();
    await seedInterests();

    await seedVisionCategory();
    await seedVisions();

    await seedChallenges();

    await seedAttachments();
    await seedBookmarks();
    await seedChallengeDays();
    await seedChallengeInterests();
    await seedChallengeVisions();
    await seedParticipatingChallenges();

    await seedParticipatingAttendances();

    await seedReviews();

    console.log("Seed completed");

    process.exit(0);

  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
