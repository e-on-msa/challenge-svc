const { ChallengeVision } = require("../models");

const challengeVisionData = [
  { challenge_id: 1, vision_id: 56 },  // 스포츠 선수 (SPO)
  { challenge_id: 2, vision_id: 6 },   // 초등교사 (EDU)
  { challenge_id: 3, vision_id: 24 },  // 소프트웨어 개발자 (ENG)
  { challenge_id: 4, vision_id: 28 },  // 앱 개발자 (IT)
  { challenge_id: 5, vision_id: 31 },  // 일러스트레이터 (ART)
  { challenge_id: 6, vision_id: 47 },  // 환경 보호 활동가 (ENV)
  { challenge_id: 7, vision_id: 47 },  // 환경 보호 활동가 (ENV)
  { challenge_id: 8, vision_id: 43 },  // 체육 교사 (SPO)
  { challenge_id: 9, vision_id: 24 },  // 소프트웨어 개발자 (ENG)
  { challenge_id: 10, vision_id: 36 }, // 애니메이터 (ART)
];

const seedChallengeVisions = async () => {
  await ChallengeVision.bulkCreate(challengeVisionData, {
    ignoreDuplicates: true,
  });
  console.log("ChallengeVision seed completed");
};

module.exports = seedChallengeVisions;
