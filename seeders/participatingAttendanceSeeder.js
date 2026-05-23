const {
  ParticipatingAttendance,
  ParticipatingChallenge,
} = require("../models");

const attendanceData = [
  { challenge_id: 1, user_id: 1, attendance_date: "2025-06-11", attendance_state: "출석", memo: "잘 참여함" },
  { challenge_id: 1, user_id: 1, attendance_date: "2025-06-12", attendance_state: "출석", memo: "조금 늦게 입장" },
  { challenge_id: 1, user_id: 1, attendance_date: "2025-06-13", attendance_state: "결석", memo: "감기" },
  { challenge_id: 2, user_id: 3, attendance_date: "2025-07-02", attendance_state: "출석", memo: null },
  { challenge_id: 2, user_id: 3, attendance_date: "2025-07-03", attendance_state: "출석", memo: null },
  { challenge_id: 3, user_id: 5, attendance_date: "2025-06-15", attendance_state: "출석", memo: null },
  { challenge_id: 3, user_id: 6, attendance_date: "2025-06-16", attendance_state: "출석", memo: null },
  { challenge_id: 4, user_id: 2, attendance_date: "2025-07-01", attendance_state: "출석", memo: null },
  { challenge_id: 4, user_id: 2, attendance_date: "2025-07-02", attendance_state: "출석", memo: null },
  { challenge_id: 5, user_id: 4, attendance_date: "2025-06-20", attendance_state: "출석", memo: null },
  { challenge_id: 6, user_id: 3, attendance_date: "2025-07-05", attendance_state: "출석", memo: null },
  { challenge_id: 7, user_id: 2, attendance_date: "2025-07-11", attendance_state: "출석", memo: null },
  { challenge_id: 7, user_id: 2, attendance_date: "2025-07-12", attendance_state: "출석", memo: null },
  { challenge_id: 8, user_id: 6, attendance_date: "2025-06-25", attendance_state: "출석", memo: null },
  { challenge_id: 9, user_id: 5, attendance_date: "2025-07-01", attendance_state: "출석", memo: "첫날 열정적" },
  { challenge_id: 9, user_id: 5, attendance_date: "2025-07-02", attendance_state: "출석", memo: null },
  { challenge_id: 10, user_id: 1, attendance_date: "2025-08-01", attendance_state: "출석", memo: null },
];

const seedParticipatingAttendances = async () => {
  const rows = [];

  for (const item of attendanceData) {
    const participant = await ParticipatingChallenge.findOne({
      where: {
        challenge_id: item.challenge_id,
        user_id: item.user_id,
      },
    });

    if (!participant) {
      throw new Error(
        `참여 정보 없음 challenge=${item.challenge_id}, user=${item.user_id}`
      );
    }

    rows.push({
      attendance_date: item.attendance_date,
      attendance_state: item.attendance_state,
      memo: item.memo,
      participating_id: participant.participating_id,
    });
  }

  await ParticipatingAttendance.bulkCreate(rows, {
    ignoreDuplicates: true,
  });

  console.log("ParticipatingAttendance seed completed");
};

module.exports = seedParticipatingAttendances;
