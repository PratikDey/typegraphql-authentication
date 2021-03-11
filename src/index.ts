import { ApolloServer } from "apollo-server-express";
import "reflect-metadata";
import Express from "express";
import { createConnection } from "typeorm";
import session from "express-session";
import connectRedis from "connect-redis";
import { redis } from "./redis";
import cors from "cors";
import { createSchema } from "./utils/createSchema";

declare module "express-session" {
  export interface SessionData {
    userId: number;
  }
}

const main = async () => {
  await createConnection();

  const RedisStore = connectRedis(session);

  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({ req, res }),
  });

  const app = Express();

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000",
    })
  );

  app.use(
    session({
      store: new RedisStore({
        client: redis as any,
      }),
      name: "qid",
      secret: "sjhadkjahdwuhdakd1234",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
    } as any)
  );

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server started on 4000");
  });
};

main();
