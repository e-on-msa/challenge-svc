'use strict';

module.exports = (sequelize, DataTypes) => {
  const InterestCategory = sequelize.define('InterestCategory', {
    category_code: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    category_name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  }, {
    tableName: 'interest_categories',
    timestamps: false,
  });

  return InterestCategory;
};
