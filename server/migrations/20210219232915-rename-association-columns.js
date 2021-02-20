'use strict';

module.exports = {
  up: async (queryInterface) => {
    queryInterface.renameColumn('Classroom', 'teacherId', 'TeacherId');
    queryInterface.renameColumn('Notification', 'senderId', 'SenderId');
    queryInterface.renameColumn('Notification', 'recipientId', 'RecipientId');
  },

  down: async (queryInterface) => {
    queryInterface.renameColumn('Classroom', 'TeacherId', 'teacherId');
    queryInterface.renameColumn('Notification', 'SenderId', 'senderId');
    queryInterface.renameColumn('Notification', 'RecipientId', 'recipientId');
  }
};
