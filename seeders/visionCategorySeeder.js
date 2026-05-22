const { VisionCategory } = require("../models");

const visionCategoryData = [
  { category_code: "MED", category_name: "의료 / 보건" },
  { category_code: "EDU", category_name: "교육 / 상담" },
  { category_code: "ENG", category_name: "공학 / 기술" },
  { category_code: "SCI", category_name: "과학 / 연구" },
  { category_code: "IT",  category_name: "IT / 컴퓨터" },
  { category_code: "ART", category_name: "디자인 / 예술" },
  { category_code: "CNT", category_name: "문화 / 콘텐츠" },
  { category_code: "LAW", category_name: "법 / 행정" },
  { category_code: "BUS", category_name: "경영 / 마케팅" },
  { category_code: "ENV", category_name: "환경 / 생태" },
  { category_code: "SPO", category_name: "스포츠 / 체육" },
  { category_code: "FAS", category_name: "패션 / 뷰티" },
  { category_code: "FOO", category_name: "요리 / 제과" },
  { category_code: "ETC", category_name: "기타 / 미정" },
];

const seedVisionCategories = async () => {
  await VisionCategory.bulkCreate(visionCategoryData, {
    updateOnDuplicate: ["category_name"],
  });
  console.log("VisionCategory seed completed");
};

module.exports = seedVisionCategories;
