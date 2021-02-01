'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Classroom', {
      id: {
        type: Sequelize.DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      teacherId: {
        type: Sequelize.DataTypes.STRING,
        references: {
          model: 'User',
          key: 'id'
        },
        allowNull: false,
      }
    }, {
      uniqueKeys: {
        uniquePair: {
          fields: ['teacherId', 'name'],
          customIndex: true
        }
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Classroom');
  }
};