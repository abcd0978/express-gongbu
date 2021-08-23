'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => 
  {
     await queryInterface.bulkInsert('posts', [{
      title: 'hello World',
      content: '<p>hello World</p>',
      user_id: 4,
      post_id: 1,
      isimg: 0,
      wchboard:'comps',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('posts', null, {});
  }
};
