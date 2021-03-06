import { ApolloServer } from "apollo-server-express";
import "reflect-metadata";
import Express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { RegisterResolver } from "./modules/user/Register";
import { LoginResolver } from "./modules/user/Login";
import session from "express-session";
import connectRedis from "connect-redis";
import { redis } from "./redis";
import cors from "cors";
import { MeResolver } from "./modules/user/Me";

declare module "express-session" {
  export interface SessionData {
    userId: number;
  }
}

const main = async () => {
  await createConnection();

  const RedisStore = connectRedis(session);

  const schema = await buildSchema({
    resolvers: [MeResolver, RegisterResolver, LoginResolver],
    authChecker: ({ context: { req } }) => {
      // here we can read the user from context
      // and check his permission in the db against the `roles` argument
      // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]

      if (req.session.userId) {
        return true;
      }

      return false; // or false if access is denied
    },
  });
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }: any) => ({ req }),
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
