import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { authController } from "./controllers/auth";
import { songsController } from "./controllers/songs";
import { staticPlugin } from "@elysiajs/static";

const app = new Elysia()
  .use(swagger())
  .use(staticPlugin())
  .group("/api", (app) => app.use(authController).use(songsController))
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
