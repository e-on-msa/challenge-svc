-- =================================================================
-- user_id 12 (LeeSujeong / test@test.com) &
-- user_id 14 (ian33 / ian33@test.com) 테스트 데이터
--
-- 전제: deploy-test-seed.sql이 먼저 실행된 상태여야 합니다.
--       user-svc에 user_id 12, 14가 존재해야 writer/creator 이름이 채워집니다.
--
-- 시나리오:
--   challenge 201 (APPROVED, user_id=12 개설) — user_id 14 참여·출석·리뷰
--   challenge 202 (APPROVED, user_id=14 개설) — user_id 12 참여·출석·리뷰
--   challenge 203 (PENDING,  user_id=14 개설) — 관리자용 상세 조회 테스트
-- =================================================================

SET NAMES utf8mb4;

-- -----------------------------------------------------------------
-- 1. 챌린지
-- -----------------------------------------------------------------
INSERT INTO `challenges` (
  `challenge_id`, `challenge_title`, `challenge_description`,
  `creator_contact`, `minimum_age`, `maximum_age`, `maximum_people`,
  `application_deadline`, `start_date`, `end_date`,
  `is_recurring`, `repeat_type`, `intermediate_participation`,
  `challenge_state`, `status`, `user_id`,
  `created_at`, `updated_at`
) VALUES
  -- 201: LeeSujeong(12) 개설, APPROVED
  (201,
   '매일 영어 필사 챌린지',
   '매일 짧은 영어 문장을 필사하며 어휘력과 문장력을 키웁니다.',
   '010-2222-3333',
   13, 19, 15,
   '2026-06-10 23:59:59',
   '2026-06-15 09:00:00',
   '2026-07-15 23:59:59',
   TRUE, 'DAILY', TRUE,
   'ACTIVE', 'APPROVED', 12,
   NOW(), NOW()),

  -- 202: ian33(14) 개설, APPROVED
  (202,
   '주 3회 러닝 크루',
   '월·수·금 아침 7시에 함께 달리며 체력과 루틴을 만들어가는 챌린지입니다.',
   '010-4444-5555',
   14, 20, 20,
   '2026-06-12 23:59:59',
   '2026-06-16 07:00:00',
   '2026-07-25 08:00:00',
   TRUE, 'WEEKLY', FALSE,
   'ACTIVE', 'APPROVED', 14,
   NOW(), NOW()),

  -- 203: ian33(14) 개설, PENDING (관리자 조회 테스트)
  (203,
   '독립영화 감상 & 토론 클럽',
   '격주로 독립영화 한 편을 함께 보고 각자의 감상을 나눕니다.',
   '010-6666-7777',
   15, 25, 10,
   '2026-06-20 23:59:59',
   '2026-06-28 18:00:00',
   '2026-08-30 20:00:00',
   TRUE, 'WEEKLY', FALSE,
   'ACTIVE', 'PENDING', 14,
   NOW(), NOW())
ON DUPLICATE KEY UPDATE
  `challenge_title`            = VALUES(`challenge_title`),
  `challenge_description`      = VALUES(`challenge_description`),
  `creator_contact`            = VALUES(`creator_contact`),
  `minimum_age`                = VALUES(`minimum_age`),
  `maximum_age`                = VALUES(`maximum_age`),
  `maximum_people`             = VALUES(`maximum_people`),
  `application_deadline`       = VALUES(`application_deadline`),
  `start_date`                 = VALUES(`start_date`),
  `end_date`                   = VALUES(`end_date`),
  `is_recurring`               = VALUES(`is_recurring`),
  `repeat_type`                = VALUES(`repeat_type`),
  `intermediate_participation` = VALUES(`intermediate_participation`),
  `challenge_state`            = VALUES(`challenge_state`),
  `status`                     = VALUES(`status`),
  `user_id`                    = VALUES(`user_id`),
  `updated_at`                 = NOW();

-- -----------------------------------------------------------------
-- 2. 챌린지 요일
-- -----------------------------------------------------------------
INSERT IGNORE INTO `challenge_days` (`challenge_id`, `day_of_week`) VALUES
  -- 201: 매일
  (201, 'Monday'), (201, 'Tuesday'), (201, 'Wednesday'),
  (201, 'Thursday'), (201, 'Friday'), (201, 'Saturday'), (201, 'Sunday'),
  -- 202: 월·수·금
  (202, 'Monday'), (202, 'Wednesday'), (202, 'Friday'),
  -- 203: 격주 토요일 (요일 등록은 Saturday)
  (203, 'Saturday');

-- -----------------------------------------------------------------
-- 3. 첨부파일
-- -----------------------------------------------------------------
INSERT INTO `attachments` (`attachment_name`, `url`, `attachment_type`, `challenge_id`) VALUES
  ('영어 필사 예문 모음',    'https://example.com/english-sentences.pdf', '문서',  201),
  ('러닝 코스 안내 지도',    'https://example.com/running-map.jpg',        '이미지', 202),
  ('독립영화 추천 리스트',   'https://example.com/indie-films.pdf',        '문서',  203);

-- -----------------------------------------------------------------
-- 4. 챌린지-관심사 연결
-- -----------------------------------------------------------------
INSERT IGNORE INTO `challenge_interests` (`challenge_id`, `interest_id`) VALUES
  (201, 5),   -- 언어학 (A01)
  (201, 6),   -- 국제관계 (A01)
  (202, 37),  -- 수영 (A08) → 스포츠 관심사 중 가장 근접
  (202, 40),  -- 육상 (A08)
  (203, 22),  -- 영상편집 (A05)
  (203, 24);  -- 촬영기법 (A05)

-- -----------------------------------------------------------------
-- 5. 챌린지-비전 연결
-- -----------------------------------------------------------------
INSERT IGNORE INTO `challenge_visions` (`challenge_id`, `vision_id`) VALUES
  (201, 7),   -- 중등교사 (EDU)
  (202, 51),  -- 스포츠 선수 (SPO)
  (202, 53),  -- 스포츠 트레이너 (SPO)
  (203, 31),  -- 영상 콘텐츠 제작자 (CNT)
  (203, 33);  -- 영화감독 (CNT)

-- -----------------------------------------------------------------
-- 6. 참여 데이터
--    user 14(ian33)   → challenge 201 (LeeSujeong 개설)
--    user 12(LeeSujeong) → challenge 202 (ian33 개설)
-- -----------------------------------------------------------------
INSERT INTO `participating_challenges` (`participating_state`, `challenge_id`, `user_id`) VALUES
  ('진행 중', 201, 14),
  ('진행 중', 202, 12)
ON DUPLICATE KEY UPDATE `participating_state` = VALUES(`participating_state`);

-- -----------------------------------------------------------------
-- 7. 출석 데이터 — challenge 201, 참여자 user_id 14
-- -----------------------------------------------------------------
INSERT INTO `participating_attendances` (`attendance_date`, `attendance_state`, `memo`, `participating_id`)
SELECT '2026-06-16', '출석', '첫날 필사 완료', pc.`participating_id`
FROM `participating_challenges` pc
WHERE pc.`challenge_id` = 201 AND pc.`user_id` = 14;

INSERT INTO `participating_attendances` (`attendance_date`, `attendance_state`, `memo`, `participating_id`)
SELECT '2026-06-17', '출석', NULL, pc.`participating_id`
FROM `participating_challenges` pc
WHERE pc.`challenge_id` = 201 AND pc.`user_id` = 14;

INSERT INTO `participating_attendances` (`attendance_date`, `attendance_state`, `memo`, `participating_id`)
SELECT '2026-06-18', '결석', '시험 준비로 불참', pc.`participating_id`
FROM `participating_challenges` pc
WHERE pc.`challenge_id` = 201 AND pc.`user_id` = 14;

INSERT INTO `participating_attendances` (`attendance_date`, `attendance_state`, `memo`, `participating_id`)
SELECT '2026-06-19', '출석', NULL, pc.`participating_id`
FROM `participating_challenges` pc
WHERE pc.`challenge_id` = 201 AND pc.`user_id` = 14;

-- -----------------------------------------------------------------
-- 8. 출석 데이터 — challenge 202, 참여자 user_id 12
-- -----------------------------------------------------------------
INSERT INTO `participating_attendances` (`attendance_date`, `attendance_state`, `memo`, `participating_id`)
SELECT '2026-06-16', '출석', '첫 러닝 완주!', pc.`participating_id`
FROM `participating_challenges` pc
WHERE pc.`challenge_id` = 202 AND pc.`user_id` = 12;

INSERT INTO `participating_attendances` (`attendance_date`, `attendance_state`, `memo`, `participating_id`)
SELECT '2026-06-18', '출석', NULL, pc.`participating_id`
FROM `participating_challenges` pc
WHERE pc.`challenge_id` = 202 AND pc.`user_id` = 12;

INSERT INTO `participating_attendances` (`attendance_date`, `attendance_state`, `memo`, `participating_id`)
SELECT '2026-06-20', '결석', '비가 와서 결석', pc.`participating_id`
FROM `participating_challenges` pc
WHERE pc.`challenge_id` = 202 AND pc.`user_id` = 12;

-- -----------------------------------------------------------------
-- 9. 리뷰
--    user 14(ian33)      → challenge 201 리뷰
--    user 12(LeeSujeong) → challenge 202 리뷰
-- -----------------------------------------------------------------
INSERT INTO `reviews` (`rating_stars`, `text`, `is_edited`, `review_date`, `challenge_id`, `user_id`) VALUES
  (5, '매일 꾸준히 하니까 영어 실력이 눈에 띄게 늘었어요. 강력 추천합니다!', FALSE, '2026-06-25 21:00:00', 201, 14),
  (4, '같이 뛰는 사람들 덕분에 포기 안 하고 버텼어요. 다음 기수도 신청할 거예요.', FALSE, '2026-06-26 09:30:00', 202, 12)
ON DUPLICATE KEY UPDATE
  `rating_stars` = VALUES(`rating_stars`),
  `text`         = VALUES(`text`),
  `is_edited`    = VALUES(`is_edited`),
  `review_date`  = VALUES(`review_date`);

-- -----------------------------------------------------------------
-- 10. 북마크
-- -----------------------------------------------------------------
INSERT IGNORE INTO `bookmarks` (`challenge_id`, `user_id`) VALUES
  (201, 12),  -- LeeSujeong이 자신이 만든 챌린지 북마크 (테스트용)
  (202, 14),  -- ian33이 자신이 만든 챌린지 북마크 (테스트용)
  (101, 12),  -- LeeSujeong이 기존 챌린지 101 북마크
  (101, 14);  -- ian33이 기존 챌린지 101 북마크

-- =================================================================
-- 확인 쿼리
-- =================================================================
-- SELECT 'challenges' AS tbl, COUNT(*) AS cnt FROM challenges WHERE challenge_id IN (201,202,203)
-- UNION ALL SELECT 'challenge_days',           COUNT(*) FROM challenge_days           WHERE challenge_id IN (201,202,203)
-- UNION ALL SELECT 'attachments',              COUNT(*) FROM attachments              WHERE challenge_id IN (201,202,203)
-- UNION ALL SELECT 'challenge_interests',      COUNT(*) FROM challenge_interests      WHERE challenge_id IN (201,202,203)
-- UNION ALL SELECT 'challenge_visions',        COUNT(*) FROM challenge_visions        WHERE challenge_id IN (201,202,203)
-- UNION ALL SELECT 'participating_challenges', COUNT(*) FROM participating_challenges WHERE challenge_id IN (201,202,203)
-- UNION ALL SELECT 'participating_attendances',COUNT(*) FROM participating_attendances
--           WHERE participating_id IN (SELECT participating_id FROM participating_challenges WHERE challenge_id IN (201,202,203))
-- UNION ALL SELECT 'reviews',   COUNT(*) FROM reviews   WHERE challenge_id IN (201,202,203)
-- UNION ALL SELECT 'bookmarks', COUNT(*) FROM bookmarks WHERE challenge_id IN (201,202,203);
