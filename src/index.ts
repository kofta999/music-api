import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { swaggerConfig } from "./lib/swagger";
import { swagger } from "@elysiajs/swagger";
import { authController } from "./controllers/auth";
import { songsController } from "./controllers/songs";
import { playlistsController } from "./controllers/playlists";
import { artistsController } from "./controllers/artists";

const app = new Elysia()
  .use(swagger(swaggerConfig))
  .use(staticPlugin())
  .group("/api", (app) =>
    app
      .use(authController)
      .use(songsController)
      .use(playlistsController)
      .use(artistsController),
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
