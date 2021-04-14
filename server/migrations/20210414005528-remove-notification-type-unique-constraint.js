'use strict';

module.exports = {
  up: async (queryInterface) => {
    queryInterface.removeConstraint('Notification', 'Notification_type_key')
  },

  down: async (queryInterface) => {
    queryInterface.addConstraint('Notification', {
      fields: ['type'],
      name: 'Notification_type_key',
      type: 'unique',
    })
  }
};
