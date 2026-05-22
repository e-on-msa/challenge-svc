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
    tableName: 'Challenge_Interest',
    timestamps: false,
  });

  return ChallengeInterest;
};
