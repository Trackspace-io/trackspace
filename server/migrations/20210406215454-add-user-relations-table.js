'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserRelation', {
      id: {
        type: Sequelize.DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      User1Id: {
        type: Sequelize.DataTypes.STRING,
        references: {
          model: 'User',
          key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE'
      },
      User2Id: {
        type: Sequelize.DataTypes.STRING,
        references: {
          model: 'User',
          key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE'
      },
      confirmed: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
      },

      // Timestamps
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    }, {
      indexes: [
        {
          unique: true,
          fields: ["User1Id", "User2Id"],
        },
      ],
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('UserRelation');
  }
};