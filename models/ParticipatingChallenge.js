'use strict';

module.exports = (sequelize, DataTypes) => {
  const ParticipatingChallenge = sequelize.define('ParticipatingChallenge', {
    participating_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    participating_state: {
      type: DataTypes.ENUM('신청', '진행 중', '완료', '취소'),
      allowNull: false,
      defaultValue: '신청',
    },
    challenge_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  }, {
    tableName: 'ParticipatingChallenge',
    timestamps: false,
  });

  return ParticipatingChallenge;
};
