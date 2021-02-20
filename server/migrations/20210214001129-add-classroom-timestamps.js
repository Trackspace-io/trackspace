'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Classroom',
        'createdAt',
        Sequelize.DATE
      ),
      queryInterface.addColumn(
        'Classroom',
        'updatedAt',
        Sequelize.STRING
      ),
    ]);
  },

  down: (queryInterface) => {
    return Promise.all([
      queryInterface.removeColumn('Classroom', 'createdAt'),
      queryInterface.removeColumn('Classroom', 'updatedAt')
    ]);
  }
};