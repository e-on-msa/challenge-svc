const { ChallengeInterest } = require("../models");

const challengeInterestData = [
  { challenge_id: 1, interest_id: 33 },  // 축구 (A08, 운동)
  { challenge_id: 2, interest_id: 1 },   // 철학 (A01, 인문)
  { challenge_id: 3, interest_id: 29 },  // 웹 개발 (A06, IT)
  { challenge_id: 4, interest_id: 5 },   // 언어학 (A01)
  { challenge_id: 5, interest_id: 15 },  // 회화 (A03, 예술)
  { challenge_id: 6, interest_id: 46 },  // 청소년 리더십 캠프 (A09)
  { challenge_id: 7, interest_id: 43 },  // 환경보호활동 (A09)
  { challenge_id: 8, interest_id: 21 },  // 피아노 (A04, 음악)
  { challenge_id: 9, interest_id: 30 },  // 앱 개발 (A06, IT)
  { challenge_id: 10, interest_id: 23 }, // 연기 (A04, 음악/연극)
];

const seedChallengeInterests = async () => {
  await ChallengeInterest.bulkCreate(challengeInterestData, {
    ignoreDuplicates: true,
  });
  console.log("ChallengeInterest seed completed");
};

module.exports = seedChallengeInterests;
