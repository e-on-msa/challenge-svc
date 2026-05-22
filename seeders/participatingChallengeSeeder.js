const { ParticipatingChallenge } = require("../models");

const participatingChallengeData = [
  { participating_state: '신청', challenge_id: 1, user_id: 1 },
  { participating_state: '신청', challenge_id: 1, user_id: 2 },
  { participating_state: '신청', challenge_id: 1, user_id: 3 },
  { participating_state: '신청', challenge_id: 2, user_id: 3 },
  { participating_state: '신청', challenge_id: 2, user_id: 4 },
  { participating_state: '신청', challenge_id: 3, user_id: 5 },
  { participating_state: '신청', challenge_id: 3, user_id: 6 },
  { participating_state: '신청', challenge_id: 4, user_id: 2 },
  { participating_state: '신청', challenge_id: 4, user_id: 1 },
  { participating_state: '신청', challenge_id: 5, user_id: 4 },
  { participating_state: '신청', challenge_id: 5, user_id: 2 },
  { participating_state: '신청', challenge_id: 6, user_id: 1 },
  { participating_state: '신청', challenge_id: 6, user_id: 3 },
  { participating_state: '신청', challenge_id: 7, user_id: 5 },
  { participating_state: '신청', challenge_id: 7, user_id: 2 },
  { participating_state: '신청', challenge_id: 8, user_id: 1 },
  { participating_state: '신청', challenge_id: 8, user_id: 6 },
  { participating_state: '신청', challenge_id: 9, user_id: 3 },
  { participating_state: '신청', challenge_id: 9, user_id: 5 },
  { participating_state: '신청', challenge_id: 10, user_id: 4 },
  { participating_state: '신청', challenge_id: 10, user_id: 1 },
];

const seedParticipatingChallenges = async () => {
  await ParticipatingChallenge.bulkCreate(participatingChallengeData, {
    ignoreDuplicates: true,
  });
  console.log("ParticipatingChallenge seed completed");
};

module.exports = seedParticipatingChallenges;
