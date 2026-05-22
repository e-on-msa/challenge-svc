const { ChallengeDay } = require("../models");

const challengeDayData = [
  // 1. 만보 걷기: 평일
  { challenge_id: 1, day_of_week: 'Monday' },
  { challenge_id: 1, day_of_week: 'Tuesday' },
  { challenge_id: 1, day_of_week: 'Wednesday' },
  { challenge_id: 1, day_of_week: 'Thursday' },
  { challenge_id: 1, day_of_week: 'Friday' },

  // 2. 아침 독서: 월,수,금
  { challenge_id: 2, day_of_week: 'Monday' },
  { challenge_id: 2, day_of_week: 'Wednesday' },
  { challenge_id: 2, day_of_week: 'Friday' },

  // 3. 코딩 캠프: 주말
  { challenge_id: 3, day_of_week: 'Saturday' },
  { challenge_id: 3, day_of_week: 'Sunday' },

  // 4. 영어일기: 매일
  { challenge_id: 4, day_of_week: 'Monday' },
  { challenge_id: 4, day_of_week: 'Tuesday' },
  { challenge_id: 4, day_of_week: 'Wednesday' },
  { challenge_id: 4, day_of_week: 'Thursday' },
  { challenge_id: 4, day_of_week: 'Friday' },
  { challenge_id: 4, day_of_week: 'Saturday' },
  { challenge_id: 4, day_of_week: 'Sunday' },

  // 5. 그림 일기: 평일
  { challenge_id: 5, day_of_week: 'Monday' },
  { challenge_id: 5, day_of_week: 'Tuesday' },
  { challenge_id: 5, day_of_week: 'Wednesday' },
  { challenge_id: 5, day_of_week: 'Thursday' },
  { challenge_id: 5, day_of_week: 'Friday' },

  // 6. 스포츠 리더십: 토,일
  { challenge_id: 6, day_of_week: 'Saturday' },
  { challenge_id: 6, day_of_week: 'Sunday' },

  // 7. 친환경: 평일
  { challenge_id: 7, day_of_week: 'Monday' },
  { challenge_id: 7, day_of_week: 'Tuesday' },
  { challenge_id: 7, day_of_week: 'Wednesday' },
  { challenge_id: 7, day_of_week: 'Thursday' },
  { challenge_id: 7, day_of_week: 'Friday' },

  // 8. 아침 요가: 매일
  { challenge_id: 8, day_of_week: 'Monday' },
  { challenge_id: 8, day_of_week: 'Tuesday' },
  { challenge_id: 8, day_of_week: 'Wednesday' },
  { challenge_id: 8, day_of_week: 'Thursday' },
  { challenge_id: 8, day_of_week: 'Friday' },
  { challenge_id: 8, day_of_week: 'Saturday' },
  { challenge_id: 8, day_of_week: 'Sunday' },

  // 9. 파이썬: 매일
  { challenge_id: 9, day_of_week: 'Monday' },
  { challenge_id: 9, day_of_week: 'Tuesday' },
  { challenge_id: 9, day_of_week: 'Wednesday' },
  { challenge_id: 9, day_of_week: 'Thursday' },
  { challenge_id: 9, day_of_week: 'Friday' },
  { challenge_id: 9, day_of_week: 'Saturday' },
  { challenge_id: 9, day_of_week: 'Sunday' },

  // 10. 뮤지컬: 수,금
  { challenge_id: 10, day_of_week: 'Wednesday' },
  { challenge_id: 10, day_of_week: 'Friday' },
];

const seedChallengeDays = async () => {
  await ChallengeDay.bulkCreate(challengeDayData, {
    ignoreDuplicates: true,
  });
  console.log("ChallengeDay seed completed");
};

module.exports = seedChallengeDays;
