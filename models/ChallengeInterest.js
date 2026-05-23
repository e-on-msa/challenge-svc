'use strict';

module.exports = (sequelize, DataTypes) => {
  const ChallengeInterest = sequelize.define('ChallengeInterest', {
    challenge_interest_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    challenge_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    interest_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  }, {
    tableName: 'challenge_interests',
    timestamps: false,
    indexes: [
          {
            unique: true,
            fields: ["challenge_id", "interest_id",],
          },
    ],
  });

  return ChallengeInterest;
};
