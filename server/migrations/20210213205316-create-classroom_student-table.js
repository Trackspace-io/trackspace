'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Classroom_Student', {
      ClassroomId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'Classroom',
          key: 'id'
        },
      },
      UserId: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        },
      },

      // Timestamps
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Classroom_Student');
  }
};