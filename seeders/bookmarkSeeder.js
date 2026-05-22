const { Bookmark } = require("../models");

const bookmarkData = [
  { challenge_id: 1, user_id: 2 },
  { challenge_id: 1, user_id: 3 },
  { challenge_id: 1, user_id: 4 },
  { challenge_id: 2, user_id: 1 },
  { challenge_id: 2, user_id: 4 },
  { challenge_id: 3, user_id: 2 },
  { challenge_id: 3, user_id: 3 },
  { challenge_id: 4, user_id: 1 },
  { challenge_id: 4, user_id: 5 },
  { challenge_id: 5, user_id: 3 },
  { challenge_id: 5, user_id: 6 },
  { challenge_id: 6, user_id: 1 },
  { challenge_id: 6, user_id: 2 },
  { challenge_id: 7, user_id: 3 },
  { challenge_id: 7, user_id: 5 },
  { challenge_id: 8, user_id: 4 },
  { challenge_id: 8, user_id: 1 },
  { challenge_id: 9, user_id: 6 },
  { challenge_id: 9, user_id: 3 },
  { challenge_id: 10, user_id: 1 },
  { challenge_id: 10, user_id: 5 },
];

const seedBookmarks = async () => {
  await Bookmark.bulkCreate(bookmarkData, {
    ignoreDuplicates: true,
  });
  console.log("Bookmark seed completed");
};

module.exports = seedBookmarks;
