'use strict';

module.exports = (sequelize, DataTypes) => {
  const Challenge = sequelize.define('Challenge', {
    challenge_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    creator_contact: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'challenge_title',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'challenge_description',
    },
    minimum_age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 8 },
    },
    maximum_age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 0 },
    },
    maximum_people: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
    },
    application_deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_recurring: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    repeat_type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    intermediate_participation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    challenge_state: {
      type: DataTypes.ENUM('ACTIVE', 'CLOSED', 'CANCELLED'),
      allowNull: false,
      defaultValue: 'ACTIVE',
    },
     status: {
      type: DataTypes.ENUM('PENDING','APPROVED','REJECTED'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  }, {
    tableName: 'Challenge',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return Challenge;
};
