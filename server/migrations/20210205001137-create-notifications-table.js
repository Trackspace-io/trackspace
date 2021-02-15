'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Notification', {
      id: {
        type: Sequelize.DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      type: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      senderId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      recipientId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      params: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
      read: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
      },

      // Timestamps
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Notification');
  }
};