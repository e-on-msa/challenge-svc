const { ParticipatingAttendance } = require("../models");

const participatingAttendanceData = [
  { attendance_date: '2025-06-11', attendance_state: '출석', memo: '잘 참여함', participating_id: 1 },
  { attendance_date: '2025-06-12', attendance_state: '출석', memo: '조금 늦게 입장', participating_id: 1 },
  { attendance_date: '2025-06-13', attendance_state: '결석', memo: '감기', participating_id: 1 },
  { attendance_date: '2025-07-02', attendance_state: '출석', memo: null, participating_id: 4 },
  { attendance_date: '2025-07-03', attendance_state: '출석', memo: null, participating_id: 4 },
  { attendance_date: '2025-06-15', attendance_state: '출석', memo: null, participating_id: 6 },
  { attendance_date: '2025-06-16', attendance_state: '출석', memo: null, participating_id: 7 },
  { attendance_date: '2025-07-01', attendance_state: '출석', memo: null, participating_id: 8 },
  { attendance_date: '2025-07-02', attendance_state: '출석', memo: null, participating_id: 8 },
  { attendance_date: '2025-06-20', attendance_state: '출석', memo: null, participating_id: 10 },
  { attendance_date: '2025-07-05', attendance_state: '출석', memo: null, participating_id: 13 },
  { attendance_date: '2025-07-11', attendance_state: '출석', memo: null, participating_id: 15 },
  { attendance_date: '2025-07-12', attendance_state: '출석', memo: null, participating_id: 15 },
  { attendance_date: '2025-06-25', attendance_state: '출석', memo: null, participating_id: 17 },
  { attendance_date: '2025-07-01', attendance_state: '출석', memo: '첫날 열정적', participating_id: 19 },
  { attendance_date: '2025-07-02', attendance_state: '출석', memo: null, participating_id: 19 },
  { attendance_date: '2025-08-01', attendance_state: '출석', memo: null, participating_id: 21 },
];

const seedParticipatingAttendances = async () => {
  await ParticipatingAttendance.bulkCreate(participatingAttendanceData, {
    ignoreDuplicates: true,
  });
  console.log("ParticipatingAttendance seed completed");
};

module.exports = seedParticipatingAttendances;
