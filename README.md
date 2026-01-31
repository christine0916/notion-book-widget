# Notion 알라딘 책 검색 위젯

Notion에 임베드할 수 있는 알라딘 책 검색 위젯입니다. 책을 검색하고 클릭 한 번으로 Notion 데이터베이스에 저장할 수 있습니다.

## 기능

1. 📚 **책 제목 검색**: 알라딘에서 책을 검색합니다
2. 🔍 **책 정보 표시**: 검색 결과에서 표지 이미지, 제목, 지은이를 확인할 수 있습니다
3. 💾 **Notion 저장**: 클릭 한 번으로 책 정보를 Notion 데이터베이스에 저장합니다

## 설치 방법

### 0. Node.js 설치 (필수)

이 프로젝트를 실행하려면 Node.js가 필요합니다. Node.js가 설치되어 있지 않은 경우 다음 방법 중 하나로 설치하세요:

#### 방법 1: 공식 웹사이트에서 설치 (권장)

1. [Node.js 공식 웹사이트](https://nodejs.org/) 접속
2. LTS 버전 다운로드 (macOS용 .pkg 파일)
3. 다운로드한 파일을 실행하여 설치
4. 터미널에서 설치 확인:
   ```bash
   node --version
   npm --version
   ```

#### 방법 2: Homebrew로 설치

Homebrew가 설치되어 있는 경우:
```bash
brew install node
```

#### 설치 확인

터미널에서 다음 명령어로 확인:
```bash
node --version  # v18.x.x 이상 권장
npm --version   # 9.x.x 이상 권장
```

### 1. 의존성 설치

Node.js 설치가 완료되면 프로젝트 의존성을 설치하세요:

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example` 파일을 `.env`로 복사하고 필요한 정보를 입력하세요:

```bash
cp .env.example .env
```

#### Notion API 키 발급

1. [Notion Integrations](https://www.notion.so/my-integrations)에 접속
2. "새 통합 만들기" 클릭
3. 이름을 입력하고 생성
4. "Internal Integration Token"을 복사하여 `.env`의 `NOTION_API_KEY`에 붙여넣기

#### Notion 데이터베이스 생성 및 설정

1. Notion에서 새 데이터베이스를 생성합니다
2. 다음 컬럼들을 생성하세요:
   - **제목** (Title 타입) - 필수
   - **지은이** (Text 타입) - 필수
   - **표지** (Files & media 타입) - 필수
   - **링크** (URL 타입) - 선택사항

3. 데이터베이스 URL에서 Database ID 추출:
   - URL 형식: `https://www.notion.so/workspace/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` 부분이 Database ID입니다
   - `.env`의 `NOTION_DATABASE_ID`에 붙여넣기

4. 데이터베이스에 Integration 연결:
   - 데이터베이스 페이지에서 우측 상단 "..." 메뉴 클릭
   - "연결" → 생성한 Integration 선택

### 3. 서버 실행

```bash
npm start
```

또는 개발 모드 (자동 재시작):

```bash
npm run dev
```

서버가 `http://localhost:3000`에서 실행됩니다.

## Notion에 위젯 임베드하기

### 방법 1: 직접 URL 임베드

1. Notion 페이지에서 `/embed` 입력
2. URL 입력: `http://localhost:3000/widget.html` (또는 배포된 URL)
3. Enter 키 입력

### 방법 2: HTML 블록 사용 (권장)

1. Notion 페이지에서 `/code` 입력
2. HTML 블록 선택
3. 다음 코드 입력:

```html
<iframe 
  src="http://localhost:3000/widget.html" 
  width="100%" 
  height="600" 
  frameborder="0"
  style="border-radius: 8px;"
></iframe>
```

## 배포

### 로컬 개발

로컬에서만 사용하는 경우, 위의 방법대로 실행하면 됩니다.

### 온라인 배포 (Vercel, Heroku 등)

1. 프로젝트를 GitHub에 푸시
2. Vercel, Heroku 등의 플랫폼에 배포
3. 환경 변수 설정 (`.env` 파일의 내용)
4. 배포된 URL을 Notion에 임베드

## 문제 해결

### "Notion 데이터베이스 ID가 설정되지 않았습니다" 오류

- `.env` 파일에 `NOTION_DATABASE_ID`가 올바르게 설정되었는지 확인
- 데이터베이스 URL에서 ID를 정확히 추출했는지 확인

### "Notion에 저장하는 중 오류가 발생했습니다" 오류

- Notion Integration이 데이터베이스에 연결되어 있는지 확인
- 데이터베이스의 컬럼 이름이 정확한지 확인 (제목, 지은이, 표지, 링크)
- Notion API 키가 유효한지 확인

### 검색 결과가 나오지 않음

- 알라딘 웹사이트 구조가 변경되었을 수 있습니다
- 네트워크 연결을 확인하세요

### npm install 오류

- **"command not found: npm"** 오류가 발생하는 경우:
  - Node.js가 설치되어 있지 않습니다. 위의 "Node.js 설치" 섹션을 참고하여 설치하세요
  - 설치 후 터미널을 재시작하세요

- **다른 npm 오류가 발생하는 경우**:
  - Node.js 버전이 너무 낮을 수 있습니다 (v18 이상 권장)
  - `npm cache clean --force` 실행 후 다시 시도
  - `node_modules` 폴더와 `package-lock.json` 삭제 후 재설치

## 라이선스

MIT
