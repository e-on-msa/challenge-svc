const { Interests } = require("../models");

const interestData = [
  // A01 인문/사회
  { interest_id: 1,  interest_detail: "철학", category_code: "A01" },
  { interest_id: 2,  interest_detail: "심리학", category_code: "A01" },
  { interest_id: 3,  interest_detail: "역사", category_code: "A01" },
  { interest_id: 4,  interest_detail: "사회학", category_code: "A01" },
  { interest_id: 5,  interest_detail: "언어학", category_code: "A01" },
  { interest_id: 6,  interest_detail: "국제관계", category_code: "A01" },

  // A02 자연과학
  { interest_id: 7,  interest_detail: "생물학", category_code: "A02" },
  { interest_id: 8,  interest_detail: "화학", category_code: "A02" },
  { interest_id: 9,  interest_detail: "물리학", category_code: "A02" },
  { interest_id: 10, interest_detail: "지구과학", category_code: "A02" },
  { interest_id: 11, interest_detail: "천문학", category_code: "A02" },

  // A03 예술/디자인
  { interest_id: 12, interest_detail: "시각디자인", category_code: "A03" },
  { interest_id: 13, interest_detail: "일러스트레이션", category_code: "A03" },
  { interest_id: 14, interest_detail: "UX/UI 디자인", category_code: "A03" },
  { interest_id: 15, interest_detail: "산업디자인", category_code: "A03" },
  { interest_id: 16, interest_detail: "회화", category_code: "A03" },

  // A04 음악/연극
  { interest_id: 17, interest_detail: "피아노", category_code: "A04" },
  { interest_id: 18, interest_detail: "보컬", category_code: "A04" },
  { interest_id: 19, interest_detail: "연기", category_code: "A04" },
  { interest_id: 20, interest_detail: "작곡", category_code: "A04" },
  { interest_id: 21, interest_detail: "바이올린", category_code: "A04" },

  // A05 영상/미디어
  { interest_id: 22, interest_detail: "영상편집", category_code: "A05" },
  { interest_id: 23, interest_detail: "유튜브 제작", category_code: "A05" },
  { interest_id: 24, interest_detail: "촬영기법", category_code: "A05" },
  { interest_id: 25, interest_detail: "광고 기획", category_code: "A05" },

  // A06 IT/코딩
  { interest_id: 26, interest_detail: "웹 개발", category_code: "A06" },
  { interest_id: 27, interest_detail: "앱 개발", category_code: "A06" },
  { interest_id: 28, interest_detail: "게임 개발", category_code: "A06" },
  { interest_id: 29, interest_detail: "데이터 분석", category_code: "A06" },
  { interest_id: 30, interest_detail: "AI 프로그래밍", category_code: "A06" },

  // A07 게임
  { interest_id: 31, interest_detail: "게임기획", category_code: "A07" },
  { interest_id: 32, interest_detail: "게임아트", category_code: "A07" },
  { interest_id: 33, interest_detail: "게임프로그래밍", category_code: "A07" },
  { interest_id: 34, interest_detail: "e스포츠", category_code: "A07" },

  // A08 스포츠
  { interest_id: 35, interest_detail: "축구", category_code: "A08" },
  { interest_id: 36, interest_detail: "농구", category_code: "A08" },
  { interest_id: 37, interest_detail: "수영", category_code: "A08" },
  { interest_id: 38, interest_detail: "테니스", category_code: "A08" },
  { interest_id: 39, interest_detail: "배드민턴", category_code: "A08" },
  { interest_id: 40, interest_detail: "육상", category_code: "A08" },

  // A09 봉사/리더십
  { interest_id: 41, interest_detail: "자원봉사", category_code: "A09" },
  { interest_id: 42, interest_detail: "청소년 리더십 캠프", category_code: "A09" },
  { interest_id: 43, interest_detail: "또래상담", category_code: "A09" },
  { interest_id: 44, interest_detail: "환경보호활동", category_code: "A09" },

  // A10 창업
  { interest_id: 45, interest_detail: "스타트업 기획", category_code: "A10" },
  { interest_id: 46, interest_detail: "비즈니스 모델링", category_code: "A10" },
  { interest_id: 47, interest_detail: "창업경진대회 준비", category_code: "A10" },
  { interest_id: 48, interest_detail: "마케팅 전략", category_code: "A10" },

  // A11 요리/제과
  { interest_id: 49, interest_detail: "제과제빵", category_code: "A11" },
  { interest_id: 50, interest_detail: "한식 조리", category_code: "A11" },
  { interest_id: 51, interest_detail: "퓨전요리", category_code: "A11" },
  { interest_id: 52, interest_detail: "바리스타", category_code: "A11" },

  // A12 뷰티/패션
  { interest_id: 53, interest_detail: "메이크업", category_code: "A12" },
  { interest_id: 54, interest_detail: "헤어디자인", category_code: "A12" },
  { interest_id: 55, interest_detail: "패션 스타일링", category_code: "A12" },
  { interest_id: 56, interest_detail: "네일아트", category_code: "A12" },

  // A99 기타
  { interest_id: 57, interest_detail: "직접 입력", category_code: "A99" },
];

const seedInterests = async () => {
  await Interests.bulkCreate(interestData, {
    updateOnDuplicate: ["interest_detail", "category_code"],
  });
  console.log("Interest seed completed");
};

module.exports = seedInterests;
