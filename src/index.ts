import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { authController } from "./controllers/auth";
import { songsController } from "./controllers/songs";
import { staticPlugin } from "@elysiajs/static";
import { playlistsController } from "./controllers/playlists";
import { swaggerConfig } from "./lib/swagger";

const app = new Elysia()
  .use(swagger(swaggerConfig))
  .use(staticPlugin())
  .group("/api", (app) =>
    app.use(authController).use(songsController).use(playlistsController),
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
