require("dotenv").config();
/* 로거 모듈*/
import logger from "morgan";
/* Graphql 서버 설치 */
import { GraphQLServer } from "graphql-yoga";
/* 스키마 js라는 파일 이용해서 여러 쿼리와 resolver들을 합쳐준다. */
import schema from "./schema";
/* Passport 관련 모듈 */
import { authenticateJwt } from "./passport";

const PORT = process.env.PORT;
import { prisma } from "../generated/prisma-client";

/* context는 resolver 사이에서 정보를 공유할 때 사용 */
/* context에 prisma를 추가해줌으로써 다른곳에서 prisma를 import 할 필요 없이 3번째 인자에서 받아서 사용 가능*/
const server = new GraphQLServer({
  schema,
  context: ({ request }) => ({ request, prisma })
});

server.express.use(logger("dev"));
/* 미들웨어를 통해서 모든 요청은 authenticatejwt 함수를 통과한다. */
server.express.use(authenticateJwt);
// server.express.use(passport.authenticate("jwt"));

server.start({ PORT }, () =>
  console.log(`✅ Server Running on PORT http://localhost:${PORT}`)
);
