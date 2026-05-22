const { Visions } = require("../models");

const visionData = [
  // 의료 / 보건
  { vision_detail: "의사", category_code: "MED" },
  { vision_detail: "간호사", category_code: "MED" },
  { vision_detail: "약사", category_code: "MED" },
  { vision_detail: "수의사", category_code: "MED" },
  { vision_detail: "물리치료사", category_code: "MED" },

  // 교육 / 상담
  { vision_detail: "초등교사", category_code: "EDU" },
  { vision_detail: "중등교사", category_code: "EDU" },
  { vision_detail: "유아교육 전문가", category_code: "EDU" },
  { vision_detail: "특수교사", category_code: "EDU" },
  { vision_detail: "청소년 상담사", category_code: "EDU" },

  // 공학 / 기술
  { vision_detail: "기계 엔지니어", category_code: "ENG" },
  { vision_detail: "전자기기 개발자", category_code: "ENG" },
  { vision_detail: "로봇 개발자", category_code: "ENG" },
  { vision_detail: "소프트웨어 개발자", category_code: "ENG" },
  { vision_detail: "AI 개발자", category_code: "ENG" },

  // 과학 / 연구
  { vision_detail: "생물학자", category_code: "SCI" },
  { vision_detail: "화학 연구원", category_code: "SCI" },
  { vision_detail: "천문학자", category_code: "SCI" },
  { vision_detail: "기후 과학자", category_code: "SCI" },
  { vision_detail: "우주 탐사 연구자", category_code: "SCI" },

  // IT / 컴퓨터
  { vision_detail: "프로그래머", category_code: "IT" },
  { vision_detail: "앱 개발자", category_code: "IT" },
  { vision_detail: "웹 개발자", category_code: "IT" },
  { vision_detail: "게임 기획자", category_code: "IT" },
  { vision_detail: "데이터 분석가", category_code: "IT" },

  // 디자인 / 예술
  { vision_detail: "제품 디자이너", category_code: "ART" },
  { vision_detail: "그래픽 디자이너", category_code: "ART" },
  { vision_detail: "일러스트레이터", category_code: "ART" },
  { vision_detail: "애니메이터", category_code: "ART" },
  { vision_detail: "건축 디자이너", category_code: "ART" },

  // 문화 / 콘텐츠
  { vision_detail: "영상 콘텐츠 제작자", category_code: "CNT" },
  { vision_detail: "방송 작가", category_code: "CNT" },
  { vision_detail: "영화감독", category_code: "CNT" },
  { vision_detail: "웹툰 작가", category_code: "CNT" },
  { vision_detail: "출판 편집자", category_code: "CNT" },

  // 법 / 행정
  { vision_detail: "변호사", category_code: "LAW" },
  { vision_detail: "판사", category_code: "LAW" },
  { vision_detail: "경찰관", category_code: "LAW" },
  { vision_detail: "소방관", category_code: "LAW" },
  { vision_detail: "공무원", category_code: "LAW" },

  // 경영 / 마케팅
  { vision_detail: "창업가", category_code: "BUS" },
  { vision_detail: "마케팅 전문가", category_code: "BUS" },
  { vision_detail: "회계사", category_code: "BUS" },
  { vision_detail: "경제 분석가", category_code: "BUS" },
  { vision_detail: "인사 관리자", category_code: "BUS" },

  // 환경 / 생태
  { vision_detail: "환경 보호 활동가", category_code: "ENV" },
  { vision_detail: "생태 연구자", category_code: "ENV" },
  { vision_detail: "산림 관리자", category_code: "ENV" },
  { vision_detail: "기상 예보관", category_code: "ENV" },
  { vision_detail: "에너지 정책 전문가", category_code: "ENV" },

  // 스포츠 / 체육
  { vision_detail: "스포츠 선수", category_code: "SPO" },
  { vision_detail: "체육 교사", category_code: "SPO" },
  { vision_detail: "스포츠 트레이너", category_code: "SPO" },
  { vision_detail: "스포츠 분석가", category_code: "SPO" },
  { vision_detail: "심판 / 코치", category_code: "SPO" },

  // 패션 / 뷰티
  { vision_detail: "패션 디자이너", category_code: "FAS" },
  { vision_detail: "스타일리스트", category_code: "FAS" },
  { vision_detail: "헤어 디자이너", category_code: "FAS" },
  { vision_detail: "메이크업 아티스트", category_code: "FAS" },
  { vision_detail: "패션 마케터", category_code: "FAS" },

  // 요리 / 제과
  { vision_detail: "한식 셰프", category_code: "FOO" },
  { vision_detail: "제과제빵 전문가", category_code: "FOO" },
  { vision_detail: "푸드 스타일리스트", category_code: "FOO" },
  { vision_detail: "요리 연구가", category_code: "FOO" },
  { vision_detail: "조리 교사", category_code: "FOO" },

  // 기타 / 미정
  { vision_detail: "아직 모르겠어요", category_code: "ETC" },
  { vision_detail: "여러 가지 분야에 관심 있어요", category_code: "ETC" },
  { vision_detail: "부모님 / 선생님과 상담 중이에요", category_code: "ETC" },
];

const seedVisions = async () => {
  const count = await Visions.count();

  if (count > 0) {
    console.log("Vision seed skipped");
    return;
  }

  await Visions.bulkCreate(visionData);
  console.log("Vision seed completed");
};

module.exports = seedVisions;
