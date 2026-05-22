'use strict';

module.exports = (sequelize, DataTypes) => {
  const VisionCategory = sequelize.define('VisionCategory', {
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
    tableName: 'VisionCategory',
    timestamps: false,
  });

  return VisionCategory;
};
