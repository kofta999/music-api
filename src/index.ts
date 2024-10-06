import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { authController } from "./controllers/auth";
import { songsController } from "./controllers/songs";
import { staticPlugin } from "@elysiajs/static";
import { playlistsController } from "./controllers/playlists";

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "Music Streaming API",
          description: "API for a feature-rich music streaming platform",
          version: "1.0.0",
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
          },
        },
        tags: [
          {
            name: "Authentication",
            description: "User registration and authentication",
          },
          { name: "Songs", description: "Search, browse, and stream songs" },
          {
            name: "Playlists",
            description: "Create and manage user playlists",
          },
          { name: "Artists", description: "Follow artists and view profiles" },
          {
            name: "Discovery",
            description: "Music recommendations and new releases",
          },
          {
            name: "Social",
            description: "Share songs and interact with other users",
          },
          {
            name: "User Profile",
            description: "Manage user profiles and preferences",
          },
          {
            name: "Notifications",
            description: "User activity and new release alerts",
          },
        ],
      },
    }),
  )
  .use(staticPlugin())
  .group("/api", (app) =>
    app.use(authController).use(songsController).use(playlistsController),
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
