# socketio_ex202606

Node.js, Express, Socket.IO를 사용한 실시간 채팅 및 파일 업로드 예제 프로젝트입니다.

## 주요 기능

- Socket.IO 기반 실시간 채팅
- 접속/퇴장 시스템 메시지 표시
- 브라우저 클라이언트 정적 파일 제공
- Multer를 사용한 단일 파일 업로드 예제
- 개발 중 자동 재시작을 위한 Nodemon 실행 스크립트

## 기술 스택

- Node.js
- Express 5
- Socket.IO 4
- Multer
- Nodemon

## 프로젝트 구조

```text
.
├── server.js              # 기본 Socket.IO 채팅 서버
├── test-server.js         # 파일 업로드와 Socket.IO 실습용 서버
├── chat_ex01.js           # test-server.js에서 사용하는 Socket.IO 모듈
├── package.json           # 의존성 및 실행 스크립트
├── public/
│   ├── index.html         # 기본 채팅 화면
│   ├── client.js          # 채팅 클라이언트 Socket.IO 로직
│   ├── styles.css         # 채팅 화면 스타일
│   ├── photo.html         # 파일 업로드 테스트 화면
│   └── chat_ex01.html     # Socket.IO 이벤트 수신 테스트 화면
└── uploads/               # 업로드된 파일 저장 위치
```

## 설치

```bash
npm install
```

PowerShell에서 `npm.ps1` 실행 정책 오류가 발생하면 다음처럼 `npm.cmd`를 사용합니다.

```bash
npm.cmd install
```

## 실행 방법

### 기본 채팅 서버 실행

```bash
npm start
```

브라우저에서 다음 주소로 접속합니다.

```text
http://localhost:3000
```

여러 브라우저 창을 열고 메시지를 보내면 실시간으로 채팅이 동기화됩니다.

### 개발 서버 실행

```bash
npm run dev
```

이 명령은 `nodemon test-server.js`를 실행합니다. 코드가 변경되면 서버가 자동으로 재시작됩니다.

## 화면 및 라우트

| 경로 | 설명 |
| --- | --- |
| `/` | 기본 실시간 채팅 화면 |
| `/photo.html` | 파일 업로드 테스트 화면 |
| `/chat_ex01.html` | Socket.IO 이벤트 수신 테스트 화면 |
| `/uploads/{파일명}` | 업로드된 파일 접근 경로 |
| `/process/photo` | 파일 업로드 POST 처리 경로 |

## Socket.IO 이벤트

### `server.js`

| 이벤트 | 방향 | 설명 |
| --- | --- | --- |
| `connection` | 서버 수신 | 클라이언트가 접속했을 때 실행 |
| `chat:message` | 클라이언트 -> 서버 | 채팅 메시지 전송 |
| `chat:message` | 서버 -> 클라이언트 | 전체 클라이언트에게 채팅 메시지 브로드캐스트 |
| `system:message` | 서버 -> 클라이언트 | 사용자 입장/퇴장 알림 |
| `disconnect` | 서버 수신 | 클라이언트 연결 해제 시 실행 |

### `chat_ex01.js`

`test-server.js`에서 불러오는 별도 Socket.IO 예제 모듈입니다.

| 이벤트 | 설명 |
| --- | --- |
| `this` | 접속한 모든 클라이언트에 테스트 데이터 전송 |
| `news` | 접속한 모든 클라이언트에 뉴스 데이터 전송 |
| `private  message` | 클라이언트에서 보낸 개인 메시지 로그 출력 |
| `user disconnected` | 연결 해제 알림 전송 |

## 파일 업로드 테스트

개발 서버를 실행합니다.

```bash
npm run dev
```

브라우저에서 다음 주소에 접속합니다.

```text
http://localhost:3000/photo.html
```

파일을 선택해 업로드하면 `uploads/` 디렉터리에 `시간값_원본파일명` 형식으로 저장됩니다.

## 참고 사항

- 기본 포트는 `3000`입니다.
- `server.js`는 `process.env.PORT`가 있으면 해당 값을 사용합니다.
- `test-server.js`는 현재 코드상 `3000` 포트를 직접 사용합니다.
- 일부 기존 HTML/주석 문자열은 인코딩이 깨져 표시될 수 있습니다.
