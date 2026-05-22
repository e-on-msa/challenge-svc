require("dotenv").config();

const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");

const Challenge = require("./Challenge")(sequelize, DataTypes);
const Attachment = require("./Attachment")(sequelize, DataTypes);
const Bookmark = require("./Bookmark")(sequelize, DataTypes);
const ChallengeDay = require("./ChallengeDay")(sequelize, DataTypes);
const ChallengeInterest = require("./ChallengeInterest")(sequelize, DataTypes);
const ChallengeVision = require("./ChallengeVision")(sequelize, DataTypes);
const InterestCategory = require("./InterestCategory")(sequelize, DataTypes);
const Interests = require("./Interests")(sequelize, DataTypes);
const ParticipatingChallenge = require("./ParticipatingChallenge")(sequelize, DataTypes);
const ParticipatingAttendance = require("./ParticipatingAttendance")(sequelize, DataTypes);
const Review = require("./Review")(sequelize, DataTypes);
const VisionCategory = require("./VisionCategory")(sequelize, DataTypes);
const Visions = require("./Visions")(sequelize, DataTypes);


// 관계 설정
// Challenge - Attachment
Challenge.hasMany(Attachment, {
    foreignKey: "challenge_id",
    as: "attachments",
    onDelete: 'CASCADE',
});
Attachment.belongsTo(Challenge, {
    foreignKey: "challenge_id",
});

// Challenge - Bookmark
Challenge.hasMany(Bookmark, {
    foreignKey: "challenge_id",
    as: "bookmarks",
    onDelete: 'CASCADE',
});
Bookmark.belongsTo(Challenge, {
    foreignKey: "challenge_id",
});

// Challenge - Review
Challenge.hasMany(Review, {
    foreignKey: "challenge_id",
    as: "reviews",
    onDelete: 'CASCADE',
});
Review.belongsTo(Challenge, {
    foreignKey: "challenge_id",
});

// Challenge - ChallengeDay
Challenge.hasMany(ChallengeDay, {
    foreignKey: "challenge_id",
    as: "days",
    onDelete: 'CASCADE',
});
ChallengeDay.belongsTo(Challenge, {
    foreignKey: "challenge_id",
});

// Challenge - ChallengeInterest
Challenge.belongsToMany(Interests, {
    through: ChallengeInterest,
    foreignKey: "challenge_id",
    otherKey: "interest_id",
    as: "interests",
});
ChallengeInterest.belongsTo(Challenge, {
  foreignKey: "challenge_id",
  onDelete: "CASCADE",
});

// ChallengeInterest - Interests
Interests.belongsToMany(Challenge, {
    through: ChallengeInterest,
    foreignKey: "interest_id",
    otherKey: "challenge_id",
    as: "challenges"
});
ChallengeInterest.belongsTo(Interests, {
  foreignKey: "interest_id",
  onDelete: "CASCADE",
});

// Challenge - ChallengeVison
Challenge.belongsToMany(Visions, {
    through: ChallengeVision,
    foreignKey: "challenge_id",
    otherKey: "vision_id",
    as: "visions",
});
ChallengeVision.belongsTo(Challenge, {
  foreignKey: "challenge_id",
  onDelete: "CASCADE",
});

// ChallengeVison - Visions
Visions.belongsToMany(Challenge, {
    through: ChallengeVision,
    foreignKey: "vision_id",
    otherKey: "challenge_id",
    as: "challenges",
});
ChallengeVision.belongsTo(Visions, {
  foreignKey: "vision_id",
  onDelete: "CASCADE",
});

// Interests - InterestCategory
InterestCategory.hasMany(Interests, {
    foreignKey: "category_code",
    as: 'interests',
    onDelete: 'CASCADE',
});
Interests.belongsTo(InterestCategory, {
    foreignKey: "category_code",
    as: 'category',
});

// Visions - VisionCategory
VisionCategory.hasMany(Visions, {
    foreignKey: "category_code",
    as: "visions",
    onDelete: 'CASCADE',
});
Visions.belongsTo(VisionCategory, {
    foreignKey: "category_code",
    as: 'category',
});

// Challenge - ParticipatingChallenge
Challenge.hasMany(ParticipatingChallenge, {
    foreignKey: "challenge_id",
    as: "participants",
});
ParticipatingChallenge.belongsTo(Challenge, {
    foreignKey: "challenge_id",
});

// ParticipatingChallenge - ParticipatingAttendance
ParticipatingChallenge.hasMany(ParticipatingAttendance, {
    foreignKey: "participating_id",
    as: "attendances",
});
ParticipatingAttendance.belongsTo(ParticipatingChallenge, {
    foreignKey: "participating_id",
    as: "participant",
});

module.exports = {
    sequelize,

    Challenge,
    Attachment,
    Bookmark,
    ChallengeDay,

    ChallengeInterest,
    ChallengeVision,

    InterestCategory,
    Interests,

    VisionCategory,
    Visions,

    ParticipatingChallenge,
    ParticipatingAttendance,
    Review,
};