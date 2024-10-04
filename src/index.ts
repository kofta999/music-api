import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { authController, authorizer } from "./controllers/auth";

const app = new Elysia()
  .use(swagger())
  .group("/api", (app) =>
    app
      .use(authController)
      .use(authorizer)
      .get("/", ({ userId }) => `Hello ${userId}`),
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
