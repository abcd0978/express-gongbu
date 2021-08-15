'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.bulkInsert('posts', [
    {
      title: 'hello',
      content: 'hello',
      user_id: 4,
      post_id: 1,
      isimg: 0,
      wchboard:'comps',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello2',
      content: 'hello2',
      user_id: 4,
      post_id: 2,
      isimg: 0,
      wchboard:'sfw',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello3',
      content: 'hello3',
      user_id: 4,
      post_id: 3,
      isimg: 0,
      wchboard:'nsfw',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello',
      content: 'hello',
      user_id: 4,
      post_id: 4,
      isimg: 0,
      wchboard:'comps',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello2',
      content: 'hello2',
      user_id: 4,
      post_id: 5,
      isimg: 0,
      wchboard:'sfw',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello3',
      content: 'hello3',
      user_id: 4,
      post_id: 6,
      isimg: 0,
      wchboard:'nsfw',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello',
      content: 'hello',
      user_id: 4,
      post_id: 7,
      isimg: 0,
      wchboard:'comps',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello2',
      content: 'hello2',
      user_id: 4,
      post_id: 8,
      isimg: 0,
      wchboard:'sfw',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello3',
      content: 'hello3',
      user_id: 4,
      post_id: 9,
      isimg: 0,
      wchboard:'nsfw',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello',
      content: 'hello',
      user_id: 4,
      post_id: 10,
      isimg: 0,
      wchboard:'comps',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello2',
      content: 'hello2',
      user_id: 4,
      post_id: 11,
      isimg: 0,
      wchboard:'sfw',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello3',
      content: 'hello3',
      user_id: 4,
      post_id: 12,
      isimg: 0,
      wchboard:'nsfw',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello',
      content: 'hello',
      user_id: 4,
      post_id: 13,
      isimg: 0,
      wchboard:'comps',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello',
      content: 'hello',
      user_id: 4,
      post_id: 14,
      isimg: 0,
      wchboard:'comps',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello',
      content: 'hello',
      user_id: 4,
      post_id: 15,
      isimg: 0,
      wchboard:'comps',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello',
      content: 'hello',
      user_id: 4,
      post_id: 16,
      isimg: 0,
      wchboard:'comps',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello',
      content: 'hello',
      user_id: 4,
      post_id: 17,
      isimg: 0,
      wchboard:'comps',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello',
      content: 'hello',
      user_id: 4,
      post_id: 18,
      isimg: 0,
      wchboard:'comps',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello',
      content: 'hello',
      user_id: 4,
      post_id: 19,
      isimg: 0,
      wchboard:'comps',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello',
      content: 'hello',
      user_id: 4,
      post_id: 20,
      isimg: 0,
      wchboard:'comps',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello',
      content: 'hello',
      user_id: 4,
      post_id: 21,
      isimg: 0,
      wchboard:'comps',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello',
      content: 'hello',
      user_id: 4,
      post_id: 22,
      isimg: 0,
      wchboard:'comps',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello',
      content: 'hello',
      user_id: 4,
      post_id: 23,
      isimg: 0,
      wchboard:'comps',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello',
      content: 'hello',
      user_id: 4,
      post_id: 24,
      isimg: 0,
      wchboard:'comps',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello',
      content: 'hello',
      user_id: 4,
      post_id: 25,
      isimg: 0,
      wchboard:'comps',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello',
      content: 'hello',
      user_id: 4,
      post_id: 26,
      isimg: 0,
      wchboard:'comps',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello',
      content: 'hello',
      user_id: 4,
      post_id: 27,
      isimg: 0,
      wchboard:'comps',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello',
      content: 'hello',
      user_id: 4,
      post_id: 28,
      isimg: 0,
      wchboard:'comps',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello',
      content: 'hello',
      user_id: 4,
      post_id: 29,
      isimg: 0,
      wchboard:'comps',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello',
      content: 'hello',
      user_id: 4,
      post_id: 30,
      isimg: 0,
      wchboard:'comps',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello',
      content: 'hello',
      user_id: 4,
      post_id: 31,
      isimg: 0,
      wchboard:'comps',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello',
      content: 'hello',
      user_id: 4,
      post_id: 32,
      isimg: 0,
      wchboard:'comps',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello',
      content: 'hello',
      user_id: 4,
      post_id: 33,
      isimg: 0,
      wchboard:'comps',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello',
      content: 'hello',
      password:'1234',
      ip:'14,38,252,76',
      who:'ㅇㅇ',
      post_id: 34,
      isimg: 0,
      wchboard:'comps',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello',
      content: 'hello',
      password:'1234',
      ip:'14,38,252,76',
      who:'ㅇㅇ',
      post_id: 35,
      isimg: 0,
      wchboard:'comps',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello',
      content: 'hello',
      password:'1234',
      ip:'14,38,252,76',
      who:'ㅇㅇ',
      post_id: 36,
      isimg: 0,
      wchboard:'comps',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello',
      content: 'hello',
      password:'1234',
      ip:'14,38,252,76',
      who:'ㅇㅇ',
      post_id: 37,
      isimg: 0,
      wchboard:'comps',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello',
      content: 'hello',
      password:'1234',
      ip:'14,38,252,76',
      who:'ㅇㅇ',
      post_id: 38,
      isimg: 0,
      wchboard:'comps',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello',
      content: 'hello',
      password:'1234',
      ip:'14,38,252,76',
      who:'ㅇㅇ',
      post_id: 39,
      isimg: 0,
      wchboard:'comps',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    {
      title: 'hello',
      content: 'hello',
      password:'1234',
      ip:'14,38,252,76',
      who:'ㅇㅇ',
      post_id: 40,
      isimg: 0,
      wchboard:'comps',
      createdAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      updatedAt: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
  ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('posts', null, {});
  }
};
