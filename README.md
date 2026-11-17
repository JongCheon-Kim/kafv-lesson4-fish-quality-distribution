# 제4차시 v0.4.9 단일 HTML 복구 배포본

압축을 해제한 다음 index.html을 직접 엽니다. 다른 파일/폴더는 필요하지 않습니다.
기존 GitHub 저장소 kafv-lesson4-fish-quality-distribution의 main 브랜치 최상위에 index.html 한 개만 업로드하여 덮어씁니다. 기존 파일 삭제 금지. Commit changes 후 Ctrl+F5.

기존 v0.4.8 PATCH는 v0.4.7 전체 폴더에 병합하는 변경 파일 패키지로 단독 실행용이 아니었습니다. 교육 데이터 로딩 오류는 app.js 초기 검사에서 KAFV_LECTURES 또는 KAFV_KB가 누락된 때 발생합니다. 사용자 환경의 정확한 누락 경로는 미확인 상태입니다.
이번 버전은 v0.4.8 공통 이론 UI를 유지하며 기존 스크립트, CSS, 강의 데이터, 지식 DB와 110개 이미지/음향 파일을 내장했습니다. 기존 실습 엔진은 경로 연결 1건(worker.webp) 외 로직 변경 없음.
