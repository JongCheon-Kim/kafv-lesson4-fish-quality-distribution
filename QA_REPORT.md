# v0.4.9 복구 검수

- 기준: v0.4.8 FULL 및 사용자 제공 v0.4.7 원본
- 이미지/음향 110건 base64 인코딩 후 원본 바이트 환원 일치
- index.html 크기: 20,931,827 bytes; SHA-256: 2450fececb37f23ef72854f8d1d0bc682edceb5fb028a317050aaf36e00a2ab2
- Chromium: 배포용 단일 HTML 원문을 변경 없이 set_content로 직접 실행, 외부 자산 요청 0건
- 실제 file:// 브라우저 탐색은 환경 관리 정책 ERR_BLOCKED_BY_ADMINISTRATOR로 불가, GitHub 게시/Windows 로컬/실물 기기/모든 개별 미션 수행/실제 음향 청취/새로고침 저장 영속성 미검증
- 시뮬레이터 소스는 worker.webp의 내장 URL 참조 1건만 변경. 기존 데이터 원문 유지, 이미지 경로는 로딩 후 내장 URL로 매핑
- 자동 회귀검수 42/42 통과

1. PASS — app initializes
2. PASS — default thumbnails hidden
3. PASS — 35/35 content, rendered image, dropdown, active thumb, part, original practice link visibility
4. PASS — PART 1–4 native fullscreen, thumb navigation, image click restore
5. PASS — thumb toggle on
6. PASS — thumb toggle off
7. PASS — panel collapse
8. PASS — panel restore
9. PASS — splitter adjusts width
10. PASS — image opens PIP
11. PASS — PIP drag
12. PASS — PIP resize
13. PASS — PIP maximize
14. PASS — PIP maximize restore
15. PASS — PIP native fullscreen image restores to dock and preserves cut
16. PASS — native Esc exits
17. PASS — reference QR renders
18. PASS — QR link target
19. PASS — chat term Q&A preserved
20. PASS — linked mission visible
21. PASS — linked mission transitions to simulator
22. PASS — simulator returns to same cut
23. PASS — 7 rooms / 24 missions unchanged
24. PASS — form 33 opens
25. PASS — form 33 save feedback
26. PASS — form 33 CSV export
27. PASS — form 34 opens
28. PASS — form 34 save feedback
29. PASS — form 34 CSV export
30. PASS — form 35 opens
31. PASS — form 35 save feedback
32. PASS — form 35 CSV export
33. PASS — header audio control mirrors simulator
34. PASS — header mission CSV export
35. PASS — switch to game docks PIP
36. PASS — 1366x768 desktop no horizontal overflow
37. PASS — 1024x768 desktop no horizontal overflow
38. PASS — mobile no horizontal overflow
39. PASS — mobile PIP
40. PASS — mobile PIP restore
41. PASS — no JS page errors
42. PASS — no external asset requests
