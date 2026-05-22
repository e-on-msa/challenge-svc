const { Attachment } = require("../models");

const attachmentData = [
  { attachment_name: '만보기 인증샷', url: 'https://example.com/walkproof.jpg', attachment_type: '이미지', challenge_id: 1 },
  { attachment_name: '독서리스트', url: 'https://example.com/booklist.pdf', attachment_type: '문서', challenge_id: 2 },
  { attachment_name: '코딩문제집', url: 'https://example.com/coding.pdf', attachment_type: '문서', challenge_id: 3 },
  { attachment_name: '영어일기 양식', url: 'https://example.com/diary.docx', attachment_type: '문서', challenge_id: 4 },
  { attachment_name: '그림샘플', url: 'https://example.com/art.jpg', attachment_type: '이미지', challenge_id: 5 },
  { attachment_name: '리더십 교재', url: 'https://example.com/leadership.pdf', attachment_type: '문서', challenge_id: 6 },
  { attachment_name: '플라스틱 줄이기 안내', url: 'https://example.com/eco.pdf', attachment_type: '문서', challenge_id: 7 },
  { attachment_name: '요가 동영상', url: 'https://example.com/yoga.mp4', attachment_type: '영상', challenge_id: 8 },
  { attachment_name: '파이썬 문제 리스트', url: 'https://example.com/python.xlsx', attachment_type: '문서', challenge_id: 9 },
  { attachment_name: '뮤지컬 대본', url: 'https://example.com/musical.docx', attachment_type: '문서', challenge_id: 10 },
];

const seedAttachments = async () => {
  await Attachment.bulkCreate(attachmentData, {
    ignoreDuplicates: true,
  });
  console.log("Attachment seed completed");
};

module.exports = seedAttachments;
