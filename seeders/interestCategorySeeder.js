const { InterestCategory } = require("../models");

const interestCategoryData = [
  { category_code: "A01", category_name: "인문/사회" },
  { category_code: "A02", category_name: "자연과학" },
  { category_code: "A03", category_name: "예술/디자인" },
  { category_code: "A04", category_name: "음악/연극" },
  { category_code: "A05", category_name: "영상/미디어" },
  { category_code: "A06", category_name: "IT/코딩" },
  { category_code: "A07", category_name: "게임" },
  { category_code: "A08", category_name: "스포츠" },
  { category_code: "A09", category_name: "봉사/리더십" },
  { category_code: "A10", category_name: "창업" },
  { category_code: "A11", category_name: "요리/제과" },
  { category_code: "A12", category_name: "뷰티/패션" },
  { category_code: "A99", category_name: "기타 (직접 입력)" },
];

const seedInterestCategories = async () => {
  const count = await InterestCategory.count();

  if (count > 0) {
    console.log("InterestCategory seed skipped");
    return;
  }

  await InterestCategory.bulkCreate(interestCategoryData);
  console.log("InterestCategory seed completed");
};

module.exports = seedInterestCategories;
