import { ElysiaSwaggerConfig } from "@elysiajs/swagger";

export const swaggerConfig = {
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
} satisfies ElysiaSwaggerConfig;
