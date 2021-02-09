'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ShortLink', {
      id: {
        type: Sequelize.DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      url: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      expirationDate: Sequelize.DataTypes.DATE
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('ShortLink');
  }
};