'use strict';

module.exports = {
  up: async (queryInterface) => {
    Promise.all([
      queryInterface.removeColumn('Notification', 'SenderId'),
      queryInterface.removeColumn('Notification', 'read')
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.addColumn('Notification', 'SenderId', {
        type: Sequelize.DataTypes.STRING,
        references: {
          model: 'User',
          key: 'id'
        },
        allowNull: false,
      }),

      queryInterface.addColumn('Notification', 'read', {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
      })
    ]);
  }
};
