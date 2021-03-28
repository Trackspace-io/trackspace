'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Goal', {
      id: {
        type: Sequelize.DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      weekNumber: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      pages: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      TermId: {
        type: Sequelize.DataTypes.STRING,
        references: {
          model: 'Term',
          key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE'
      },

      // Timestamps
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    }, {
      indexes: [
        {
          unique: true,
          fields: ["TermId", "weekNumber"],
        },
      ],
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Goal');
  }
};