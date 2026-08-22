export type LogLevel = 'error' | 'warn' | 'info' | 'debug'

// 규칙: 이 함수로는 Authorization 헤더/JWT/refresh token/쿠키, 비밀번호, Google·Apple OAuth
// 토큰, RR/HRV 원본 데이터, 증상·약물 등 건강 기록, request body 전체, 이메일 같은 직접
// 식별자를 절대 넣지 않는다 — userId(내부 UUID) 정도만 운영 디버깅용으로 허용한다.
//
// 파일로 직접 저장하지 않고 stdout/stderr에 한 줄짜리 JSON만 남긴다 — Render 같은 PaaS에서는
// 앱이 로그 파일 로테이션까지 책임지기보다, stdout/stderr만 책임지고 필요해지면 로그 수집기가
// 그걸 가져가는 구조가 깔끔하다. level별로 스트림을 나눠(error/warn → stderr) 나중에 로그
// 수집기를 붙였을 때 심각도로 바로 필터링할 수 있게 한다.
export function logJson(level: LogLevel, fields: Record<string, unknown>): void {
  const line = JSON.stringify({ level, timestamp: new Date().toISOString(), ...fields })
  if (level === 'error') console.error(line)
  else if (level === 'warn') console.warn(line)
  else console.log(line)
}
