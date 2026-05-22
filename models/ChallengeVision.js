'use strict';

module.exports = (sequelize, DataTypes) => {
  const ChallengeVision = sequelize.define('ChallengeVision', {
    challenge_vision_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    challenge_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    vision_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  }, {
    tableName: 'Challenge_Vision',
    timestamps: false,
  });

  return ChallengeVision;
};
