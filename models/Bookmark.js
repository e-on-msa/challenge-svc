'use strict';

module.exports = (sequelize, DataTypes) => {
  const Bookmark = sequelize.define('Bookmark', {
    bookmark_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },

      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      challenge_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    }, {
      tableName: 'bookmarks',
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ['user_id', 'challenge_id'],
        },
      ],
    }
  );

  return Bookmark;
};