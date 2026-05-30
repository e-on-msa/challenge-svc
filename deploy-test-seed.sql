-- =================================================================
-- challenge-svc 배포 환경 테스트 데이터 (user-svc 연동 검증용)
-- 실행 전 확인: user-svc에 user_id 1, 2, 4 이 반드시 존재해야 합니다.
--
-- 테스트 시나리오:
--   챌린지 상세 조회        → challenge_id = 101 (APPROVED, user_id=1 개설)
--   리뷰 목록 조회          → challenge_id = 101 (user_id 2, 4 작성)
--   챌린지별 출석 목록 조회 → challenge_id = 101 (user_id 2, 4 참여·출석 기록)
--   관리자용 챌린지 상세    → challenge_id = 103 (PENDING, user_id=4 개설)
--   챌린지 참여 테스트      → challenge_id = 102 (APPROVED, 신청 가능)
--   챌린지 개설 테스트      → POST 요청만 필요 (아래 기준 데이터 필요)
-- =================================================================

SET NAMES utf8mb4;

-- -----------------------------------------------------------------
-- 1. 관심사 카테고리 (interest_categories)
-- -----------------------------------------------------------------
INSERT INTO `interest_categories` (`category_code`, `category_name`) VALUES
  ('A01', '인문/사회'),
  ('A02', '자연과학'),
  ('A03', '예술/디자인'),
  ('A04', '음악/연극'),
  ('A05', '영상/미디어'),
  ('A06', 'IT/코딩'),
  ('A07', '게임'),
  ('A08', '스포츠'),
  ('A09', '봉사/리더십'),
  ('A10', '창업'),
  ('A11', '요리/제과'),
  ('A12', '뷰티/패션'),
  ('A99', '기타 (직접 입력)')
ON DUPLICATE KEY UPDATE `category_name` = VALUES(`category_name`);

-- -----------------------------------------------------------------
-- 2. 관심사 (interests) — 테스트에 필요한 항목만 포함
-- -----------------------------------------------------------------
INSERT INTO `interests` (`interest_id`, `interest_detail`, `category_code`) VALUES
  (1,  '철학',           'A01'),
  (2,  '심리학',         'A01'),
  (3,  '역사',           'A01'),
  (4,  '사회학',         'A01'),
  (5,  '언어학',         'A01'),
  (6,  '국제관계',       'A01'),
  (7,  '생물학',         'A02'),
  (8,  '화학',           'A02'),
  (9,  '물리학',         'A02'),
  (10, '지구과학',       'A02'),
  (11, '천문학',         'A02'),
  (12, '시각디자인',     'A03'),
  (13, '일러스트레이션', 'A03'),
  (14, 'UX/UI 디자인',   'A03'),
  (15, '산업디자인',     'A03'),
  (16, '회화',           'A03'),
  (17, '피아노',         'A04'),
  (18, '보컬',           'A04'),
  (19, '연기',           'A04'),
  (20, '작곡',           'A04'),
  (21, '바이올린',       'A04'),
  (22, '영상편집',       'A05'),
  (23, '유튜브 제작',    'A05'),
  (24, '촬영기법',       'A05'),
  (25, '광고 기획',      'A05'),
  (26, '웹 개발',        'A06'),
  (27, '앱 개발',        'A06'),
  (28, '게임 개발',      'A06'),
  (29, '데이터 분석',    'A06'),
  (30, 'AI 프로그래밍',  'A06'),
  (31, '게임기획',       'A07'),
  (32, '게임아트',       'A07'),
  (33, '게임프로그래밍', 'A07'),
  (34, 'e스포츠',        'A07'),
  (35, '축구',           'A08'),
  (36, '농구',           'A08'),
  (37, '수영',           'A08'),
  (38, '테니스',         'A08'),
  (39, '배드민턴',       'A08'),
  (40, '육상',           'A08'),
  (41, '자원봉사',            'A09'),
  (42, '청소년 리더십 캠프',  'A09'),
  (43, '또래상담',            'A09'),
  (44, '환경보호활동',        'A09'),
  (45, '스타트업 기획',       'A10'),
  (46, '비즈니스 모델링',     'A10'),
  (47, '창업경진대회 준비',   'A10'),
  (48, '마케팅 전략',         'A10'),
  (49, '제과제빵',   'A11'),
  (50, '한식 조리',  'A11'),
  (51, '퓨전요리',   'A11'),
  (52, '바리스타',   'A11'),
  (53, '메이크업',         'A12'),
  (54, '헤어디자인',       'A12'),
  (55, '패션 스타일링',    'A12'),
  (56, '네일아트',         'A12'),
  (57, '직접 입력',        'A99')
ON DUPLICATE KEY UPDATE `interest_detail` = VALUES(`interest_detail`), `category_code` = VALUES(`category_code`);

-- -----------------------------------------------------------------
-- 3. 비전 카테고리 (vision_categories)
-- -----------------------------------------------------------------
INSERT INTO `vision_categories` (`category_code`, `category_name`) VALUES
  ('MED', '의료 / 보건'),
  ('EDU', '교육 / 상담'),
  ('ENG', '공학 / 기술'),
  ('SCI', '과학 / 연구'),
  ('IT',  'IT / 컴퓨터'),
  ('ART', '디자인 / 예술'),
  ('CNT', '문화 / 콘텐츠'),
  ('LAW', '법 / 행정'),
  ('BUS', '경영 / 마케팅'),
  ('ENV', '환경 / 생태'),
  ('SPO', '스포츠 / 체육'),
  ('FAS', '패션 / 뷰티'),
  ('FOO', '요리 / 제과'),
  ('ETC', '기타 / 미정')
ON DUPLICATE KEY UPDATE `category_name` = VALUES(`category_name`);

-- -----------------------------------------------------------------
-- 4. 비전 (visions)
-- -----------------------------------------------------------------
INSERT INTO `visions` (`vision_id`, `vision_detail`, `category_code`) VALUES
  (1,  '의사',              'MED'),
  (2,  '간호사',            'MED'),
  (3,  '약사',              'MED'),
  (4,  '수의사',            'MED'),
  (5,  '물리치료사',        'MED'),
  (6,  '초등교사',          'EDU'),
  (7,  '중등교사',          'EDU'),
  (8,  '유아교육 전문가',   'EDU'),
  (9,  '특수교사',          'EDU'),
  (10, '청소년 상담사',     'EDU'),
  (11, '기계 엔지니어',     'ENG'),
  (12, '전자기기 개발자',   'ENG'),
  (13, '로봇 개발자',       'ENG'),
  (14, '소프트웨어 개발자', 'ENG'),
  (15, 'AI 개발자',         'ENG'),
  (16, '생물학자',      'SCI'),
  (17, '화학 연구원',   'SCI'),
  (18, '천문학자',      'SCI'),
  (19, '기후 과학자',   'SCI'),
  (20, '우주 탐사 연구자',  'SCI'),
  (21, '프로그래머',    'IT'),
  (22, '앱 개발자',     'IT'),
  (23, '웹 개발자',     'IT'),
  (24, '게임 기획자',   'IT'),
  (25, '데이터 분석가', 'IT'),
  (26, '제품 디자이너',   'ART'),
  (27, '그래픽 디자이너', 'ART'),
  (28, '일러스트레이터',  'ART'),
  (29, '애니메이터',      'ART'),
  (30, '건축 디자이너',   'ART'),
  (31, '영상 콘텐츠 제작자', 'CNT'),
  (32, '방송 작가',          'CNT'),
  (33, '영화감독',           'CNT'),
  (34, '웹툰 작가',          'CNT'),
  (35, '출판 편집자',        'CNT'),
  (36, '변호사', 'LAW'),
  (37, '판사',   'LAW'),
  (38, '경찰관', 'LAW'),
  (39, '소방관', 'LAW'),
  (40, '공무원', 'LAW'),
  (41, '창업가',       'BUS'),
  (42, '마케팅 전문가','BUS'),
  (43, '회계사',       'BUS'),
  (44, '경제 분석가',  'BUS'),
  (45, '인사 관리자',  'BUS'),
  (46, '환경 보호 활동가', 'ENV'),
  (47, '생태 연구자',      'ENV'),
  (48, '산림 관리자',      'ENV'),
  (49, '기상 예보관',      'ENV'),
  (50, '에너지 정책 전문가','ENV'),
  (51, '스포츠 선수',   'SPO'),
  (52, '체육 교사',     'SPO'),
  (53, '스포츠 트레이너','SPO'),
  (54, '스포츠 분석가', 'SPO'),
  (55, '심판 / 코치',   'SPO'),
  (56, '패션 디자이너', 'FAS'),
  (57, '스타일리스트',  'FAS'),
  (58, '헤어 디자이너', 'FAS'),
  (59, '메이크업 아티스트','FAS'),
  (60, '패션 마케터',   'FAS'),
  (61, '한식 셰프',           'FOO'),
  (62, '제과제빵 전문가',     'FOO'),
  (63, '푸드 스타일리스트',   'FOO'),
  (64, '요리 연구가',         'FOO'),
  (65, '조리 교사',           'FOO'),
  (66, '아직 모르겠어요',             'ETC'),
  (67, '여러 가지 분야에 관심 있어요', 'ETC'),
  (68, '부모님 / 선생님과 상담 중이에요','ETC')
ON DUPLICATE KEY UPDATE `vision_detail` = VALUES(`vision_detail`), `category_code` = VALUES(`category_code`);

-- =================================================================
-- 5. 테스트 챌린지
--    user_id 1 = 챌린지 101 개설자  (user-svc에 존재 필요)
--    user_id 2 = 챌린지 102 개설자  (user-svc에 존재 필요)
--    user_id 4 = 챌린지 103 개설자  (user-svc에 존재 필요)
-- =================================================================
INSERT INTO `challenges` (
  `challenge_id`, `challenge_title`, `challenge_description`,
  `creator_contact`, `minimum_age`, `maximum_age`, `maximum_people`,
  `application_deadline`, `start_date`, `end_date`,
  `is_recurring`, `repeat_type`, `intermediate_participation`,
  `challenge_state`, `status`, `user_id`,
  `created_at`, `updated_at`
) VALUES
  -- 101: 진행 중인 APPROVED 챌린지
  --      상세 조회 / 리뷰 목록 / 출석 목록 테스트
  (101,
   '주말 코딩 스터디',
   '매주 토·일 모여서 알고리즘 문제를 함께 풀고 코드 리뷰를 진행합니다.',
   '010-1111-2222',
   14, 19, 20,
   '2026-05-10 23:59:59',
   '2026-05-16 10:00:00',
   '2026-06-28 18:00:00',
   TRUE, 'WEEKLY', FALSE,
   'ACTIVE', 'APPROVED', 1,
   NOW(), NOW()),

  -- 102: 신청 가능한 APPROVED 챌린지
  --      챌린지 참여 테스트 (user_id 1이 로그인하여 신청)
  (102,
   '여름방학 독서 마라톤',
   '방학 동안 매일 30분씩 책을 읽고 독후감을 공유하는 챌린지입니다.',
   '010-3333-4444',
   12, 18, 30,
   '2026-06-10 23:59:59',
   '2026-06-15 09:00:00',
   '2026-07-31 23:59:59',
   TRUE, 'DAILY', TRUE,
   'ACTIVE', 'APPROVED', 2,
   NOW(), NOW()),

  -- 103: 승인 대기 중인 PENDING 챌린지
  --      관리자용 챌린지 상세 조회 테스트
  (103,
   '그림 그리기 30일 챌린지',
   '30일 동안 매일 한 장의 그림을 그리며 창의력과 표현력을 키웁니다.',
   '010-5555-6666',
   10, 18, 25,
   '2026-06-15 23:59:59',
   '2026-06-20 00:00:00',
   '2026-07-19 23:59:59',
   FALSE, NULL, TRUE,
   'ACTIVE', 'PENDING', 4,
   NOW(), NOW())
ON DUPLICATE KEY UPDATE
  `challenge_title`         = VALUES(`challenge_title`),
  `challenge_description`   = VALUES(`challenge_description`),
  `creator_contact`         = VALUES(`creator_contact`),
  `minimum_age`             = VALUES(`minimum_age`),
  `maximum_age`             = VALUES(`maximum_age`),
  `maximum_people`          = VALUES(`maximum_people`),
  `application_deadline`    = VALUES(`application_deadline`),
  `start_date`              = VALUES(`start_date`),
  `end_date`                = VALUES(`end_date`),
  `is_recurring`            = VALUES(`is_recurring`),
  `repeat_type`             = VALUES(`repeat_type`),
  `intermediate_participation` = VALUES(`intermediate_participation`),
  `challenge_state`         = VALUES(`challenge_state`),
  `status`                  = VALUES(`status`),
  `user_id`                 = VALUES(`user_id`),
  `updated_at`              = NOW();

-- -----------------------------------------------------------------
-- 6. 챌린지 요일 (challenge_days)
-- -----------------------------------------------------------------
INSERT IGNORE INTO `challenge_days` (`challenge_id`, `day_of_week`) VALUES
  -- 101: 토, 일
  (101, 'Saturday'),
  (101, 'Sunday'),
  -- 102: 매일
  (102, 'Monday'),
  (102, 'Tuesday'),
  (102, 'Wednesday'),
  (102, 'Thursday'),
  (102, 'Friday'),
  (102, 'Saturday'),
  (102, 'Sunday'),
  -- 103: 평일
  (103, 'Monday'),
  (103, 'Tuesday'),
  (103, 'Wednesday'),
  (103, 'Thursday'),
  (103, 'Friday');

-- -----------------------------------------------------------------
-- 7. 첨부파일 (attachments)
-- -----------------------------------------------------------------
INSERT INTO `attachments` (`attachment_name`, `url`, `attachment_type`, `challenge_id`) VALUES
  ('알고리즘 문제 목록', 'https://example.com/algo-list.pdf',  '문서', 101),
  ('스터디 진행 가이드', 'https://example.com/study-guide.pdf','문서', 101),
  ('추천 도서 목록',     'https://example.com/book-list.pdf',  '문서', 102),
  ('독후감 양식',        'https://example.com/book-report.docx','문서', 102),
  ('그림 샘플',          'https://example.com/drawing-sample.jpg','이미지', 103);

-- -----------------------------------------------------------------
-- 8. 챌린지-관심사 연결 (challenge_interests)
-- -----------------------------------------------------------------
INSERT IGNORE INTO `challenge_interests` (`challenge_id`, `interest_id`) VALUES
  (101, 26),  -- 웹 개발 (A06)
  (101, 29),  -- 데이터 분석 (A06)
  (102, 1),   -- 철학 (A01)
  (102, 3),   -- 역사 (A01)
  (103, 16),  -- 회화 (A03)
  (103, 13);  -- 일러스트레이션 (A03)

-- -----------------------------------------------------------------
-- 9. 챌린지-비전 연결 (challenge_visions)
-- -----------------------------------------------------------------
INSERT IGNORE INTO `challenge_visions` (`challenge_id`, `vision_id`) VALUES
  (101, 14),  -- 소프트웨어 개발자 (ENG)
  (101, 21),  -- 프로그래머 (IT)
  (102, 10),  -- 청소년 상담사 (EDU)
  (103, 28);  -- 일러스트레이터 (ART)

-- =================================================================
-- 10. 참여 데이터 (participating_challenges)
--     출석 목록 조회: challenge_id=101, 참여 상태가 '신청' 또는 '진행 중'인 행만 조회
-- =================================================================
INSERT INTO `participating_challenges` (`participating_state`, `challenge_id`, `user_id`) VALUES
  -- challenge 101 참여자
  ('진행 중', 101, 2),   -- user 2: 출석 기록 있음
  ('진행 중', 101, 4),   -- user 4: 출석 기록 있음 (결석 포함)
  -- challenge 102 참여자 (신청 단계)
  ('신청',    102, 4)    -- user 4: 아직 시작 전
ON DUPLICATE KEY UPDATE `participating_state` = VALUES(`participating_state`);

-- =================================================================
-- 11. 출석 데이터 (participating_attendances)
--     participating_id는 AUTO_INCREMENT이므로 서브쿼리로 참조
-- =================================================================
INSERT INTO `participating_attendances` (`attendance_date`, `attendance_state`, `memo`, `participating_id`)
SELECT '2026-05-17', '출석', '첫 주 토요일 참여', pc.`participating_id`
FROM `participating_challenges` pc
WHERE pc.`challenge_id` = 101 AND pc.`user_id` = 2;

INSERT INTO `participating_attendances` (`attendance_date`, `attendance_state`, `memo`, `participating_id`)
SELECT '2026-05-18', '출석', NULL, pc.`participating_id`
FROM `participating_challenges` pc
WHERE pc.`challenge_id` = 101 AND pc.`user_id` = 2;

INSERT INTO `participating_attendances` (`attendance_date`, `attendance_state`, `memo`, `participating_id`)
SELECT '2026-05-24', '출석', NULL, pc.`participating_id`
FROM `participating_challenges` pc
WHERE pc.`challenge_id` = 101 AND pc.`user_id` = 2;

INSERT INTO `participating_attendances` (`attendance_date`, `attendance_state`, `memo`, `participating_id`)
SELECT '2026-05-17', '출석', NULL, pc.`participating_id`
FROM `participating_challenges` pc
WHERE pc.`challenge_id` = 101 AND pc.`user_id` = 4;

INSERT INTO `participating_attendances` (`attendance_date`, `attendance_state`, `memo`, `participating_id`)
SELECT '2026-05-18', '결석', '개인 사정', pc.`participating_id`
FROM `participating_challenges` pc
WHERE pc.`challenge_id` = 101 AND pc.`user_id` = 4;

INSERT INTO `participating_attendances` (`attendance_date`, `attendance_state`, `memo`, `participating_id`)
SELECT '2026-05-24', '출석', NULL, pc.`participating_id`
FROM `participating_challenges` pc
WHERE pc.`challenge_id` = 101 AND pc.`user_id` = 4;

INSERT INTO `participating_attendances` (`attendance_date`, `attendance_state`, `memo`, `participating_id`)
SELECT '2026-05-25', '출석', NULL, pc.`participating_id`
FROM `participating_challenges` pc
WHERE pc.`challenge_id` = 101 AND pc.`user_id` = 4;

-- =================================================================
-- 12. 리뷰 (reviews) — challenge 101
--     user_id 2, 4 이 user-svc에 존재해야 writer.name 이 채워집니다.
-- =================================================================
INSERT INTO `reviews` (`rating_stars`, `text`, `is_edited`, `review_date`, `challenge_id`, `user_id`) VALUES
  (5, '알고리즘 실력이 눈에 띄게 늘었어요! 스터디 분위기도 너무 좋았습니다.', FALSE, '2026-05-29 21:00:00', 101, 2),
  (4, '코드 리뷰가 특히 도움이 됐어요. 다음 기수도 참여하고 싶습니다.',        FALSE, '2026-05-29 22:30:00', 101, 4)
ON DUPLICATE KEY UPDATE
  `rating_stars` = VALUES(`rating_stars`),
  `text`         = VALUES(`text`),
  `is_edited`    = VALUES(`is_edited`),
  `review_date`  = VALUES(`review_date`);

-- =================================================================
-- 13. 북마크 (bookmarks)
-- =================================================================
INSERT IGNORE INTO `bookmarks` (`challenge_id`, `user_id`) VALUES
  (101, 2),
  (101, 4),
  (102, 1),
  (102, 4);

-- =================================================================
-- 확인 쿼리 (실행 후 결과 검증)
-- =================================================================
-- SELECT 'challenges' AS tbl, COUNT(*) AS cnt FROM challenges WHERE challenge_id IN (101,102,103)
-- UNION ALL SELECT 'challenge_days',        COUNT(*) FROM challenge_days        WHERE challenge_id IN (101,102,103)
-- UNION ALL SELECT 'attachments',           COUNT(*) FROM attachments           WHERE challenge_id IN (101,102,103)
-- UNION ALL SELECT 'challenge_interests',   COUNT(*) FROM challenge_interests   WHERE challenge_id IN (101,102,103)
-- UNION ALL SELECT 'challenge_visions',     COUNT(*) FROM challenge_visions     WHERE challenge_id IN (101,102,103)
-- UNION ALL SELECT 'participating_challenges', COUNT(*) FROM participating_challenges WHERE challenge_id IN (101,102,103)
-- UNION ALL SELECT 'participating_attendances', COUNT(*) FROM participating_attendances
--           WHERE participating_id IN (SELECT participating_id FROM participating_challenges WHERE challenge_id IN (101,102,103))
-- UNION ALL SELECT 'reviews',    COUNT(*) FROM reviews    WHERE challenge_id IN (101,102,103)
-- UNION ALL SELECT 'bookmarks',  COUNT(*) FROM bookmarks  WHERE challenge_id IN (101,102,103);
