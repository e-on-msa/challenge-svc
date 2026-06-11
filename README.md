# challenge-svc

> E-ON 플랫폼의 챌린지 도메인을 담당하는 마이크로서비스입니다.
챌린지 개설/조회/수정/삭제, 참여 신청, 출석 기록, 북마크, 리뷰, 첨부파일, 챌린지 관리자, 관심사/진로희망 마스터 데이터 관리 기능을 제공합니다.



## 📁 프로젝트 구조

```
challenge-svc/
├── config/
│   ├── database.js                   # Sequelize DB 연결 설정
│   └── redis.js                      # Redis 연결 설정
├── controllers/
│   ├── challengeController.js        # 챌린지 CRUD
│   ├── adminChallengeController.js   # 관리자 챌린지 승인/반려
│   ├── internalChallengeController.js# 내부 서비스 간 API
│   ├── participationController.js    # 참여 신청/취소/조회
│   ├── attendanceController.js       # 출석 기록 추가/수정/삭제
│   ├── bookmarkController.js         # 북마크 추가/취소/목록
│   ├── reviewController.js           # 리뷰 작성/수정/삭제/조회
│   ├── attachmentController.js       # 첨부파일 업로드/삭제
│   ├── interestController.js         # 관심사 마스터 데이터 조회
│   ├── visionController.js           # 진로희망 마스터 데이터 조회
│   └── adminMasterDataController.js  # 관리자 관심사/진로희망 CRUD
├── middleware/
│   ├── auth.js                       # Gateway 헤더 기반 인증
│   └── upload.js                     # 이미지 업로드 (multer)
├── models/
│   ├── index.js                      # 모델 로드 및 관계 설정
│   ├── Challenge.js                  # 챌린지
│   ├── ChallengeDay.js               # 챌린지 요일
│   ├── ChallengeInterest.js          # 챌린지-관심사 연결
│   ├── ChallengeVision.js            # 챌린지-진로희망 연결
│   ├── ParticipatingChallenge.js     # 챌린지 참여
│   ├── ParticipatingAttendance.js    # 출석 기록
│   ├── Bookmark.js                   # 북마크
│   ├── Review.js                     # 리뷰
│   ├── Attachment.js                 # 첨부파일
│   ├── Interests.js                  # 관심사
│   ├── InterestCategory.js           # 관심사 카테고리
│   ├── Visions.js                    # 진로희망
│   └── VisionCategory.js             # 진로희망 카테고리
├── queues/
│   ├── rabbitPublisher.js            # RabbitMQ 이벤트 발행 공통 함수
│   ├── challengeEventPublisher.js    # 챌린지 이벤트 발행 (eon.events)
│   ├── masterDataEventPublisher.js   # 마스터 데이터 이벤트 발행
│   └── userEventConsumer.js          # user.events 이벤트 수신
├── routes/
│   ├── challengeRouter.js
│   ├── adminChallengeRouter.js
│   ├── internalChallengeRouter.js
│   ├── participationRouter.js
│   ├── attendanceRouter.js
│   ├── bookmarkRouter.js
│   ├── reviewRouter.js
│   ├── attachmentRouter.js
│   ├── interestRouter.js
│   ├── visionRouter.js
│   └── adminMasterDataRouter.js
├── services/
│   ├── userChallengeStatusService.js # Redis 기반 사용자 상태 저장/검증
│   └── userServiceClient.js          # user-svc 내부 API 호출
├── uploads/                          # 업로드된 이미지 저장 폴더 (로컬 스토리지)
├── .env                              # 환경변수 (git 제외)
├── .env.example
├── .gitignore
├── .dockerignore
├── Dockerfile
├── app.js                            # Express 앱 설정
├── index.js                          # 서버 진입점
└── package.json
```



## ⚙️ 환경변수 설정

`.env` 파일을 루트에 생성하고 아래 내용을 채워주세요.

```
NODE_ENV=development
PORT=8084

DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=
DB_NAME=challenge_db

# user-svc 내부 통신용
USER_SERVICE_URL=http://localhost:8081

# 이미지 스토리지 (local | gcs)
STORAGE_TYPE=local

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@localhost:5672
USER_EVENT_EXCHANGE=user.events
USER_EVENT_QUEUE=challenge-svc.user-event.queue
CHALLENGE_EVENT_EXCHANGE=eon.events
MASTER_DATA_EVENT_EXCHANGE=master-data.events

# Redis
REDIS_HOSTNAME=localhost
REDIS_PORT=6379
```



## 🚀 로컬 실행 방법

```bash
# 1. 패키지 설치
npm install

# 2. MySQL에서 DB 생성
CREATE DATABASE challenge_db;

# 3. 서버 실행
npm run dev
```

서버가 정상적으로 실행되면 아래 메시지가 출력됩니다.

```
DB 연결 성공
challenge-svc listening on :8084
[RabbitMQ] listening queue: challenge-svc.user-event.queue
```



## 🐳 Docker 실행 방법

```bash
# 이미지 빌드
docker build -t challenge-svc .

# 컨테이너 실행
docker run -p 8084:8084 --env-file .env challenge-svc
```



## 🗄️ DB 설계 원칙 (MSA)

- `challenge_db` 단독 사용
- User 테이블 FK 제거 → `user_id` 값만 보관
- 작성자 이름 등 외부 데이터는 user-svc HTTP API 호출로 조회
- 타 서비스 DB 직접 접근 금지 → HTTP API 또는 RabbitMQ 이벤트로 대체



## 🔐 인증 방식

세션을 직접 확인하지 않고 Gateway에서 넘긴 헤더를 신뢰합니다.

| 헤더 | 값 예시 | 용도 |
| --- | --- | --- |
| `X-User-Id` | `123` | 사용자 식별 |
| `X-User-Type` | `student`, `parent`, `admin` | 권한 구분 |
| `X-User-State` | `active`, `suspended` | 사용자 상태 |
| `X-User-Banned-Until` | `2026-12-31T00:00:00.000Z` | 정지 만료 시각 |

```js
// middleware/auth.js
req.user = {
  user_id:      Number(req.headers['x-user-id']),
  type:         req.headers['x-user-type'],
  state:        req.headers['x-user-state'] || 'active',
  banned_until: req.headers['x-user-banned-until'] || null,
};
```



## 📨 RabbitMQ 이벤트 수신 (user.events)

| 이벤트 | 처리 내용 |
| --- | --- |
| `user.suspended` | Redis에 `is_challenge_create_restricted=true` 저장 → 챌린지 개설 차단 |
| `user.unsuspended` | Redis에 `is_challenge_create_restricted=false` 저장 → 개설 제한 해제 |
| `user.join-restricted` | Redis에 `is_challenge_join_restricted=true` 저장 → 챌린지 참여 차단 |
| `user.join-unrestricted` | Redis에 `is_challenge_join_restricted=false` 저장 → 참여 제한 해제 |

사용자 상태는 Redis Hash(`user:{userId}:challenge_status`)에 저장되며, 챌린지 개설·참여 요청 시 실시간으로 검증됩니다.



## 📤 RabbitMQ 이벤트 발행

### eon.events Exchange (챌린지 도메인 이벤트)

| 이벤트 | 발행 시점 | 주요 Payload |
| --- | --- | --- |
| `challenge.created` | 챌린지 개설 신청 | challenge_id, user_id, title, 관심사/진로희망 태그 등 |
| `challenge.approved` | 관리자 챌린지 승인 | challenge_id, user_id, title, status=APPROVED |
| `challenge.updated` | 챌린지 정보 수정 | challenge_id, user_id, 변경된 필드 포함 전체 payload |
| `challenge.state.updated` | 챌린지 상태 변경 (ACTIVE→CLOSED 등) | previous_state, current_state 포함 |
| `challenge.deleted` | 챌린지 삭제 | challenge_id, user_id |
| `challenge.participation.created` | 참여 신청 | challenge_id, user_id, participating_id, participating_state |

### master-data.events Exchange (마스터 데이터 이벤트)

| 이벤트 | 발행 시점 |
| --- | --- |
| `interest.created` | 관심사 항목 생성 |
| `interest.updated` | 관심사 항목 수정 |
| `interest.deleted` | 관심사 항목 삭제 |
| `vision.created` | 진로희망 항목 생성 |
| `vision.updated` | 진로희망 항목 수정 |
| `vision.deleted` | 진로희망 항목 삭제 |
