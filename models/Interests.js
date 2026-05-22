'use strict';

module.exports = (sequelize, DataTypes) => {
  const Interests = sequelize.define('Interests', {
    interest_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    interest_detail: {
      type: DataTypes.STRING,
    },
    category_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'interests',
    timestamps: false,
  });

  return Interests;
};
