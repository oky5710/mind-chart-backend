<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## 사용자 역할

Google 최초 로그인 시 계정은 자동 생성되고 `role=user`가 적용됩니다. 역할을 변경하는 공개 API는
없으며, 승인 작업은 Neon SQL Editor 등 DB 관리 도구에서만 수행합니다. `admin`은 부분 유니크 인덱스로
한 계정만 허용됩니다. 역할을 바꾼 사용자는 새 역할이 포함된 JWT를 받도록 다시 로그인해야 합니다.

```sql
-- 서비스 소유자 계정 1개만 실행
UPDATE "User" SET "role" = 'admin' WHERE "email" = 'owner@example.com';

-- 승인한 연구자
UPDATE "User" SET "role" = 'researcher' WHERE "email" = 'researcher@example.com';
```

## 인증 — 액세스/refresh 토큰

로그인(`/auth/register`, `/auth/login`, `/auth/google`, `/auth/apple`)은 두 토큰을 함께 발급합니다.

- **액세스 토큰**: JWT, **15분** 유효. `Authorization: Bearer <accessToken>`으로 매 요청마다 검증.
- **refresh 토큰**: 랜덤 문자열, **30일** 유효. DB(`RefreshToken` 테이블)에는 SHA-256 해시만 저장하고
  원문은 클라이언트만 갖는다 — DB가 유출돼도 그 자체로는 로그인에 쓸 수 없다.

클라이언트는 401을 받으면 곧바로 로그아웃시키지 말고 `POST /auth/refresh`로 새 액세스 토큰을 조용히
받아 재시도해야 합니다. refresh는 호출될 때마다 기존 refresh 토큰을 폐기하고 새 토큰을 발급하는
**rotation** 방식이라, 폐기된 토큰이 재사용되면(탈취 정황) 다음 refresh 시도가 즉시 401로 실패합니다.
30일 안에 한 번이라도 앱을 열어 refresh가 성공하면 로그인 유지 기간이 그만큼 다시 30일 뒤로
밀리므로, 실제로는 "30일 넘게 완전히 앱을 안 켰을 때만" 재로그인이 필요합니다.

로그아웃은 `POST /auth/logout`으로 refresh 토큰을 명시적으로 무효화합니다 — 안 그러면 로그아웃 후에도
그 refresh 토큰으로 액세스 토큰을 계속 재발급받을 수 있습니다. 자세한 요청/응답 형식은
`api-docs.html`의 인증(Auth) 섹션 참고.

## 로깅

파일로 직접 로그를 저장하지 않고 stdout/stderr에 한 줄짜리 JSON만 남깁니다(`src/common/logger.ts`) —
Render 같은 PaaS에서는 앱이 로그 파일 로테이션까지 책임지기보다 stdout/stderr만 책임지고, 필요해지면
로그 수집기가 그걸 가져가는 구조가 깔끔합니다.

- **요청마다 `requestId`가 붙습니다**(`RequestIdMiddleware`, 업스트림이 이미 붙였으면 그대로 이어받음).
  응답 헤더 `X-Request-Id`로도 돌려주므로, "몇 시쯤 오류났어요" 같은 제보를 실제 요청 흐름으로
  추적할 수 있습니다.
- **레벨**: 5xx는 `error`(stack trace 포함), 검증 실패·인증 실패·중복·폭주(400/401/403/409/429)는
  `warn`, 404는 `info`(너무 흔해서 warn으로 두면 진짜 이상 신호가 묻힘), 성공 요청은 `info`.
- **절대 로그에 넣지 않는 것**: Authorization 헤더/JWT/refresh 토큰/쿠키, 비밀번호, Google·Apple
  OAuth 토큰, RR/HRV 원본 데이터, 증상·약물 등 건강 기록, request body 전체, 이메일 같은 직접
  식별자. `userId`(내부 UUID)만 운영 디버깅용으로 남깁니다.

로그 예시:
```json
{"level":"warn","timestamp":"2026-08-22T07:07:28.881Z","context":"HTTP","method":"GET","path":"/hrv","statusCode":401,"userId":null,"requestId":"39ef9231-8609-49ef-95d2-03e9c537f938","message":"Unauthorized"}
```

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
