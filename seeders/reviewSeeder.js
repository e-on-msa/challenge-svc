const { Review } = require("../models");

const reviewData = [
  { rating_stars: 5, text: '운동 습관에 큰 도움이 되었어요!', review_date: '2025-06-30 20:10:10', is_edited: false, challenge_id: 1, user_id: 1 },
  { rating_stars: 4, text: '매일 책 읽는 습관이 생겼어요.', review_date: '2025-07-16 09:20:00', is_edited: false, challenge_id: 2, user_id: 3 },
  { rating_stars: 5, text: '코딩 실력이 쑥쑥 늘었어요!', review_date: '2025-07-21 11:00:00', is_edited: false, challenge_id: 3, user_id: 5 },
  { rating_stars: 3, text: '조금 어려웠지만 영어 공부에 도움이 됐어요.', review_date: '2025-08-01 09:10:00', is_edited: false, challenge_id: 4, user_id: 2 },
  { rating_stars: 4, text: '매일 그림 그리니 상상력이 풍부해졌어요.', review_date: '2025-07-12 18:00:00', is_edited: false, challenge_id: 5, user_id: 4 },
  { rating_stars: 5, text: '리더십을 기를 수 있었어요!', review_date: '2025-07-26 18:00:00', is_edited: false, challenge_id: 6, user_id: 3 },
  { rating_stars: 4, text: '환경의 중요성을 알게 되었어요.', review_date: '2025-07-25 13:00:00', is_edited: false, challenge_id: 7, user_id: 5 },
  { rating_stars: 5, text: '아침 요가로 몸이 가벼워짐!', review_date: '2025-07-06 09:00:00', is_edited: false, challenge_id: 8, user_id: 1 },
  { rating_stars: 5, text: '매일 코딩 습관이 생겼어요.', review_date: '2025-07-30 23:59:59', is_edited: false, challenge_id: 9, user_id: 3 },
  { rating_stars: 4, text: '뮤지컬 준비가 즐거웠어요!', review_date: '2025-08-16 17:30:00', is_edited: false, challenge_id: 10, user_id: 4 },
];

const seedReviews = async () => {
  await Review.bulkCreate(reviewData, {
    ignoreDuplicates: true,
  });
  console.log("Review seed completed");
};

module.exports = seedReviews;
