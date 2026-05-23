'use strict';

module.exports = (sequelize, DataTypes) => {
  const ChallengeDay = sequelize.define('ChallengeDay', {
    challenge_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true, // 복합 PK
    },
    day_of_week: {
      type: DataTypes.ENUM(
        'Monday', 'Tuesday', 'Wednesday',
        'Thursday', 'Friday', 'Saturday', 'Sunday'
      ),
      allowNull: false,
      primaryKey: true, // 복합 PK
    },
  }, {
    tableName: 'challenge_days',
    timestamps: false,
  });

  return ChallengeDay;
};
