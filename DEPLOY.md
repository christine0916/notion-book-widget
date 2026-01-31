# GitHub Pages 배포 가이드

## 빠른 배포 방법

### 1. GitHub 저장소 생성
1. [GitHub](https://github.com)에 로그인
2. 우측 상단 "+" 버튼 → "New repository" 클릭
3. 저장소 이름 입력 (예: `notion-book-widget`)
4. Public으로 설정 (GitHub Pages는 Public 저장소에서 무료)
5. "Create repository" 클릭

### 2. 파일 업로드 방법 A: 웹에서 직접 업로드
1. 생성된 저장소 페이지에서 "uploading an existing file" 클릭
2. `widget-standalone.html` 파일을 드래그 앤 드롭
3. 파일명을 `index.html`로 변경 (선택사항, 이렇게 하면 URL이 더 깔끔해짐)
4. "Commit changes" 클릭

### 3. 파일 업로드 방법 B: Git 명령어 사용
터미널에서 다음 명령어 실행:

```bash
cd "/Users/mori/Desktop/Notion Widjet"

# Git 초기화 (아직 안 했다면)
git init

# 파일 추가
git add widget-standalone.html

# 커밋
git commit -m "Add Notion book widget"

# GitHub 저장소 연결 (YOUR_USERNAME과 REPO_NAME을 실제 값으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 푸시
git branch -M main
git push -u origin main
```

### 4. GitHub Pages 활성화
1. 저장소 페이지에서 "Settings" 탭 클릭
2. 왼쪽 메뉴에서 "Pages" 클릭
3. Source에서 "Deploy from a branch" 선택
4. Branch를 "main" 선택
5. Folder를 "/ (root)" 선택
6. "Save" 클릭

### 5. 배포 확인
- 몇 분 후 `https://YOUR_USERNAME.github.io/REPO_NAME/widget-standalone.html` 접속
- 또는 `index.html`로 이름을 바꿨다면 `https://YOUR_USERNAME.github.io/REPO_NAME/` 접속

## Notion에 임베드하기

배포가 완료되면 Notion에서:

1. `/code` 입력
2. HTML 블록 선택
3. 다음 코드 입력 (URL을 실제 배포 URL로 변경):

```html
<iframe 
  src="https://YOUR_USERNAME.github.io/REPO_NAME/widget-standalone.html" 
  width="100%" 
  height="700" 
  frameborder="0"
  style="border-radius: 8px;"
></iframe>
```

## 팁

- 파일명을 `index.html`로 바꾸면 URL이 더 깔끔해집니다
- 배포는 보통 1-2분 정도 걸립니다
- 변경사항을 푸시하면 자동으로 재배포됩니다
