'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Progress', {
      id: {
        type: Sequelize.DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      SubjectId: {
        type: Sequelize.DataTypes.STRING,
        references: {
          model: 'Subject',
          key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE'
      },
      StudentId: {
        type: Sequelize.DataTypes.STRING,
        references: {
          model: 'User',
          key: 'id'
        },
        allowNull: false,
        onDelete: 'CASCADE'
      },
      date: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      homeworkDone: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      pageFrom: Sequelize.DataTypes.INTEGER,
      pageSet: Sequelize.DataTypes.INTEGER,
      pageDone: Sequelize.DataTypes.INTEGER,

      // Timestamps
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    }, {
      indexes: [
        {
          unique: true,
          fields: ["SubjectId", "StudentId", "date"],
        },
      ],
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Progress');
  }
};
