# Notion 알라딘 책 검색 위젯 (Standalone 버전)

Node.js 서버 없이 순수 HTML/JavaScript로 작동하는 버전입니다. GitHub Pages에 바로 배포할 수 있습니다.

## 특징

- ✅ **서버 불필요**: Node.js 없이 브라우저에서만 작동
- ✅ **GitHub Pages 호환**: 정적 파일만으로 작동
- ✅ **CORS 프록시 사용**: 알라딘 데이터를 안전하게 가져옴
- ✅ **Notion API 직접 호출**: 브라우저에서 Notion API 사용

## 사용 방법

### 1. 파일 준비

`widget-standalone.html` 파일을 사용하세요. 이 파일 하나만 있으면 됩니다.

### 2. GitHub Pages에 배포

1. GitHub 저장소 생성
2. `widget-standalone.html` 파일을 업로드
3. 저장소 설정 → Pages → Source를 "main" 브랜치로 설정
4. 배포된 URL 확인 (예: `https://username.github.io/repo-name/widget-standalone.html`)

### 3. Notion에 임베드

1. Notion 페이지에서 `/code` 입력
2. HTML 블록 선택
3. 다음 코드 입력 (배포된 URL로 변경):

```html
<iframe 
  src="https://username.github.io/repo-name/widget-standalone.html" 
  width="100%" 
  height="700" 
  frameborder="0"
  style="border-radius: 8px;"
></iframe>
```

### 4. Notion 설정

위젯을 처음 사용할 때:
1. **Notion API Key** 입력: [Notion Integrations](https://www.notion.so/my-integrations)에서 발급
2. **Notion Database ID** 입력: Notion 데이터베이스 URL에서 추출
3. 설정은 브라우저에 자동 저장됩니다

## Notion 데이터베이스 준비

다음 컬럼들을 가진 데이터베이스를 생성하세요:
- **제목** (Title 타입) - 필수
- **지은이** (Text 타입) - 필수
- **표지** (Files & media 타입) - 필수
- **링크** (URL 타입) - 선택사항

데이터베이스에 Integration을 연결하는 것도 잊지 마세요!

## 로컬에서 테스트

로컬에서 테스트하려면 간단한 HTTP 서버를 실행하세요:

```bash
# Python 3
python3 -m http.server 8000

# 또는 Node.js가 있다면
npx http-server
```

그 후 브라우저에서 `http://localhost:8000/widget-standalone.html` 접속

## CORS 프록시

이 버전은 여러 CORS 프록시 서비스를 사용합니다:
- allorigins.win
- corsproxy.io
- codetabs.com

프록시가 작동하지 않으면 자동으로 다른 프록시로 전환합니다.

## 문제 해결

### 검색이 작동하지 않음
- CORS 프록시 서비스가 일시적으로 다운되었을 수 있습니다
- 잠시 후 다시 시도하세요
- 브라우저 콘솔에서 오류 메시지 확인

### Notion 저장이 안 됨
- Notion API Key와 Database ID가 올바른지 확인
- 데이터베이스 컬럼 이름이 정확한지 확인 (제목, 지은이, 표지, 링크)
- Integration이 데이터베이스에 연결되어 있는지 확인

## 서버 버전과의 차이점

| 기능 | Standalone 버전 | 서버 버전 |
|------|----------------|----------|
| 서버 필요 | ❌ | ✅ |
| GitHub Pages 배포 | ✅ | ❌ |
| CORS 프록시 | ✅ (자동) | ❌ (서버에서 처리) |
| 설정 저장 | localStorage | 환경 변수 |
| 보안 | API Key가 브라우저에 저장 | API Key가 서버에 저장 |

## 라이선스

MIT
