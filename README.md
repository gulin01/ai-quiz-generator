# AI 기반 영어 퀴즈 생성기 (인수인계 문서)

## 프로젝트 개요
AI 기반 영어 퀴즈 생성기 백엔드 애플리케이션입니다. NestJS, Prisma, MySQL 등을 사용하여 CEFR 수준별 스토리와 퀴즈를 생성하고 관리합니다. OpenAI API(GPT-4) 및 DALL·E를 활용한 스토리/퀴즈/이미지 생성 기능을 제공합니다.

## 기술 스택
- **언어**: TypeScript, JavaScript (Node.js)
- **프레임워크**: NestJS
- **DB ORM**: Prisma
- **데이터베이스**: MySQL (또는 PostgreSQL)
- **AI 서비스**: OpenAI (ChatCompletion, 이미지 생성), (옵션) Hugging Face Inference
- **기타**: Docker, Docker Compose

## 환경 변수
프로젝트 루트에 `.env` 파일을 생성하고 다음 값을 설정하세요.

```dotenv
OPENAI_KEY=<YOUR_OPENAI_API_KEY>
OPENAI_MODEL=gpt-4
DATABASE_URL="mysql://quizuser:QuizUser123!@localhost:3306/quizdb"
DATABASE_URL_DOCKER="mysql://root:rootpass@mysql:3306/quizdb"
HF_API_KEY=<YOUR_HF_API_KEY>
PORT=3000
```

## 설치 및 실행
### 로컬 개발 환경
```bash
git clone <REPO_URL>
cd <REPO_DIR>

npm install
npx prisma migrate dev --name init
npx prisma db seed

npm run start:dev
```

### 프로덕션 빌드 및 실행
```bash
npm run build
npm run start:prod
```

### Docker 및 Docker Compose
```bash
docker-compose up --build
```

## 데이터베이스 스키마 (Prisma)
`prisma/schema.prisma`에 정의된 주요 모델을 요약합니다.

| 모델명            | 설명                                                    |
|------------------|---------------------------------------------------------|
| Section          | 섹션(레벨 구분, 순서 지정)                               |
| Unit             | 단원(문법 포인트, 순서 지정)                            |
| Story            | AI 생성 스토리(단원별 1:1 매핑)                         |
| VocabularyItem   | 어휘 항목(단원별 연관)                                  |
| Quiz             | AI 생성 퀴즈(문제, 선택지, 정답, 설명 등)               |
| Word             | 어휘 메타 데이터(CEFR, 빈도 등)                       |
| User             | 사용자 모델(CEFR, θ 파라미터 등)                       |
| CEFR             | 레벨 열거형 (A1~C2)                                     |
| QuizType         | 퀴즈 유형 열거형 (MCQ, GAP_FILL, SENTENCE_ORDER, MATCHING) |
| QuizMode         | 퀴즈 모드 열거형 (TEXT_TO_TEXT, IMAGE_TO_TEXT, ...)     |

## 시드 데이터
`prisma/seed.ts` 스크립트를 통해 초기 데이터를 삽입합니다.

```bash
npx prisma db seed
```

## 폴더 구조
```
.
├─ src
│  ├─ main.ts
│  ├─ app.module.ts
│  ├─ prisma
│  ├─ prompts
│  ├─ quiz
│  ├─ section
│  ├─ unit
│  ├─ story
│  └─ vocabulary
├─ prisma
│  ├─ schema.prisma
│  └─ seed.ts
├─ public
├─ Dockerfile
└─ docker-compose.yml
```

## 주요 파일 설명
- `src/main.ts`: 애플리케이션 진입점 및 Swagger 설정
- `src/app.module.ts`: 루트 모듈 설정(ServeStatic, ConfigModule, PrismaModule, 기능 모듈)
- `src/prisma/prisma.service.ts`: PrismaClient 확장 모듈
- `src/prompts/quizType.prompt.ts`: 퀴즈 유형별 OpenAI 프롬프트 생성 함수
- `src/prompts/story.prompt.ts`: 스토리 생성 OpenAI 프롬프트 템플릿
- `src/quiz/quiz.service.ts`: AI 퀴즈 생성 로직 및 DB 저장
- `src/story/story.service.ts`: AI 스토리 생성 로직 및 DB 저장
- 기능 모듈 폴더(`quiz`, `section`, `unit`, `story`, `vocabulary`): Controller, Service, DTO 정의

## API 엔드포인트
### Swagger UI
애플리케이션 실행 후 `http://localhost:3000/docs`에서 확인 가능합니다.

### Sections (섹션)
| 메서드 | 경로                     | 설명              |
|-------|-------------------------|------------------|
| GET   | /sections               | 모든 섹션 조회      |
| GET   | /sections/{id}/unit     | 단원 조회          |
| POST  | /sections               | 섹션 생성          |
| PUT   | /sections/{id}          | 섹션 업데이트       |
| DELETE| /sections/{id}          | 섹션 삭제          |

### Units (단원)
| 메서드 | 경로                                    | 설명                        |
|-------|----------------------------------------|----------------------------|
| GET   | /unit?cefr={A1|...|C2}                  | 단원 조회(레벨 필터)         |
| GET   | /unit/{id}/quizzes                     | 단원별 퀴즈 조회             |
| POST  | /unit                                   | 단원 생성                   |
| PUT   | /unit/{id}                              | 단원 업데이트               |
| DELETE| /unit/{id}                              | 단원 삭제                   |

### Vocabulary (어휘)
| 메서드 | 경로                          | 설명                    |
|-------|-------------------------------|------------------------|
| GET   | /vocab                        | 모든 어휘 조회           |
| GET   | /vocab/unit/{unitId}          | 단원별 어휘 조회         |
| GET   | /vocab/{id}                   | 특정 어휘 조회           |
| POST  | /vocab                        | 어휘 생성               |
| PUT   | /vocab/{id}                   | 어휘 업데이트           |
| DELETE| /vocab/{id}                   | 어휘 삭제               |

### Stories (스토리)
| 메서드 | 경로                                         | 설명                  |
|-------|----------------------------------------------|----------------------|
| GET   | /stories                                     | 모든 스토리 조회       |
| GET   | /stories/{id}                                | 특정 스토리 조회       |
| POST  | /stories                                     | 스토리 생성           |
| PUT   | /stories/{id}                                | 스토리 업데이트       |
| DELETE| /stories/{id}                                | 스토리 삭제           |
| POST  | /stories/unit/{unitId}/generate-story        | AI 스토리 생성        |

### Quizzes (퀴즈)
| 메서드 | 경로                      | 설명                                   |
|-------|---------------------------|---------------------------------------|
| POST  | /quiz/generate            | 단원 및 퀴즈 유형별 AI 퀴즈 생성       |
| GET   | /quiz/list                | 최근 15개 퀴즈 조회                   |
| GET   | /quiz/image?text=...      | DALL·E 기반 이미지 생성 및 저장       |
| GET   | /quiz/pretest             | (미구현) 적응형 프리테스트 퀴즈 생성   |

## 사용 예제
### 퀴즈 생성 (MCQ)
```bash
curl -X POST http://localhost:3000/quiz/generate \
  -H 'Content-Type: application/json' \
  -d '{"unitId":1,"quizType":"MCQ"}'
```

### 이미지 생성
```bash
curl 'http://localhost:3000/quiz/image?text=apple'
```

### 스토리 생성
```bash
curl -X POST http://localhost:3000/stories/unit/1/generate-story \
  -H 'Content-Type: application/json' \
  -d '{"theme":"여행","length":"short"}'
```

## 인수인계 메모
- Prisma 모델 `Word` 및 `User`는 현재 코드에서 직접 사용되지 않습니다.
- `@geekie/irt` 및 `@huggingface/inference` 패키지는 추후 적응형 퀴즈 및 Hugging Face 모델 연동 용도로 추가되었으나, 아직 구현되지 않았습니다.
- 추가 기능(예: 사용자 인증, 과제 채점, 관리자 페이지 등) 개발이 가능합니다.

## 라이선스
본 프로젝트는 UNLICENSED 라이선스를 사용합니다.

## 문의
프로젝트 담당자: <Your Name / Email>
