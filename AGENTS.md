# Mind Chart
## 정신건강을 기록하는 앱

## API 문서 관리 규칙

API가 추가되거나 변경될 때마다 **`api-docs.html`** 파일을 반드시 업데이트해야 한다.

- 파일 위치: 프로젝트 루트 `/api-docs.html`
- 업데이트 대상: 새 엔드포인트 추가, Request/Response 필드 변경, 열거형(Enum) 값 변경
- 업데이트 시점: API 코드 작업이 완료된 직후 (커밋 전)
- 문서 구조: 섹션별 `<table>` — Method, Endpoint, 설명, Request, Response 5개 컬럼

## 기술 스택



## 주요 기능
* 캘린더에 날짜를 클릭해서 정신건강관련 이벤트를 입력
* 정신과 검사 결과
* 약복용 여부
* 약 종류, 용량 변동
* 정신 건강에 영향을 주는 이벤트
* 친구와의 만남
* 공연 관람
* 인간 관계 스트레스
* 특정인과의 마찰 등
* 운동
* 취미생활
* 웨어러블 디바이스의 수면, 심박변이 정보 수집 - 추후 연동 예정
* 입력된 데이터를 시계열 차트에 표시
* 각 이벤트간의 인과 관계를 분석
* 정신과 진료 시 도움을 주는 앱

* 검사 결과 입력 폼

|Category|field|type|기타|
|---|--|----|----|
|Time Domain Analysis| MHR|number||
||SDNN |number||
||RMSSD |number||
|| PSI|number||
|Freequency Domain Analysis|TP |number| 입력 칸 2개 |
||VLF|number|입력 칸 2개|
||LF|number|입력 칸 2개|
||HF|number|입력 칸 2개|
||LFNorm|number||
||HFNorm|number||
||LF/HF Ratio|number||
||Ectopic Beat|number||
|Other|SRD|number||
||Result|string||
