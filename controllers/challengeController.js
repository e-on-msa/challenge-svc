const challengeService = require("../services/challengeService");

exports.healthCheck = async (req, res, next) => {
  try {
    const result = await challengeService.healthCheck();

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};