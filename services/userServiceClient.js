const axios = require("axios");

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;

exports.getUsersByIds = async (userIds) => {
  if (!USER_SERVICE_URL || userIds.length === 0) {
    return {};
  }

  const response = await axios.get(`${USER_SERVICE_URL}/api/users/batch`, {
    params: {
      ids: userIds.join(","),
    },
  });

  return response.data.reduce((map, user) => {
    map[user.user_id] = user;
    return map;
  }, {});
};