import { Elysia, t } from "elysia";
import prisma from "../../lib/db";
import { authorizer } from "../auth";
import { generateNanoid } from "../../lib/utils";

export const playlistsController = new Elysia({
  prefix: "/playlists",
  detail: {
    tags: ["Playlists"],
    security: [{ bearerAuth: [] }],
    description: "Endpoints for managing user playlists",
  },
})
  .model(
    "new-playlist",
    t.Object({
      name: t.String({ description: "Name of the playlist" }),
      description: t.Optional(
        t.String({ description: "Description of the playlist" }),
      ),
      songs: t.Optional(
        t.Array(
          t.String({ description: "IDs of songs to add to the playlist" }),
        ),
      ),
    }),
  )
  .model(
    "edit-playlist",
    t.Object({
      name: t.Optional(t.String({ description: "New name of the playlist" })),
      description: t.Optional(
        t.String({ description: "New description of the playlist" }),
      ),
    }),
  )
  .decorate("prisma", prisma)
  .get(
    "/:publicId",
    async ({ params: { publicId }, error }) => {
      const playlist = await prisma.playlist.findUnique({
        where: { publicId },
      });

      if (!playlist) {
        return error("Not Found");
      }

      return { playlist };
    },
    {
      detail: {
        security: [],
        summary: "Get a playlist by ID",
        description: "Retrieve details of a specific playlist",
      },
      params: t.Object({
        publicId: t.String({ description: "The public ID of the playlist" }),
      }),
    },
  )
  .use(authorizer)
  .post(
    "/",
    async ({ body, prisma, userId }) => {
      // TODO: Add ability to add songs publicId (pre-populated playlist)
      const playlist = await prisma.playlist.create({
        data: {
          name: body.name,
          description: body.description,
          userId,
          publicId: generateNanoid(),
        },
      });

      return { playlistId: playlist.publicId };
    },
    {
      body: "new-playlist",
      detail: {
        summary: "Create a new playlist",
        description: "Create a new playlist for the authenticated user",
      },
    },
  )
  .put(
    "/:publicId",
    async ({ body, params: { publicId }, userId, prisma, error }) => {
      const playlist = await prisma.playlist.findUnique({
        where: { publicId, userId },
      });

      if (!playlist) {
        return error("Forbidden");
      }

      await prisma.playlist.update({ where: { publicId }, data: body });

      return { publicId };
    },
    {
      body: "edit-playlist",
      params: t.Object({
        publicId: t.String({ description: "The ID of the playlist to update" }),
      }),
      detail: {
        summary: "Update a playlist",
        description: "Update details of an existing playlist",
      },
    },
  )
  .delete(
    "/:publicId",
    async ({ params: { publicId }, userId, prisma, error, set }) => {
      const playlist = await prisma.playlist.findUnique({
        where: { publicId, userId },
      });

      if (!playlist) {
        return error("Forbidden");
      }

      await prisma.playlist.delete({
        where: { publicId },
      });

      set.status = "No Content";
    },
    {
      params: t.Object({
        publicId: t.String({ description: "The ID of the playlist to delete" }),
      }),
      detail: {
        summary: "Delete a playlist",
        description: "Delete a specific playlist",
      },
    },
  )
  .post(
    "/:publicId/songs/",
    async ({
      prisma,
      body: { songId },
      userId,
      error,
      params: { publicId },
      set,
    }) => {
      const playlist = await prisma.playlist.findUnique({
        where: { publicId, userId },
      });

      const song = await prisma.song.findUnique({
        where: { publicId: songId },
      });

      if (!playlist) {
        return error("Forbidden");
      }

      if (!song) {
        return error("Not Found");
      }

      await prisma.playlistSong.create({
        data: { songId: song.id, playlistId: playlist.id },
      });

      set.status = "Created";

      return true;
    },
    {
      body: t.Object({
        songId: t.String({
          description: "ID of the song to add to the playlist",
        }),
      }),
      params: t.Object({
        publicId: t.String({ description: "The ID of the playlist" }),
      }),
      detail: {
        summary: "Add a song to a playlist",
        description: "Add a specific song to a playlist",
      },
    },
  )
  .delete(
    "/:publicId/songs/:songId",
    async ({ set, prisma, params: { publicId, songId }, userId, error }) => {
      const playlist = await prisma.playlist.findUnique({
        where: { publicId, userId },
      });

      const song = await prisma.song.findUnique({
        where: { publicId: songId },
      });

      if (!playlist) {
        return error("Forbidden");
      }

      if (!song) {
        return error("Not Found");
      }

      const playlistSong = await prisma.playlistSong.deleteMany({
        where: {
          playlistId: playlist.id,
          songId: song.id,
        },
      });

      if (playlistSong.count === 0) {
        return error(404, "Song not found in the playlist");
      }

      set.status = "No Content";
    },
    {
      params: t.Object({
        publicId: t.String({ description: "The ID of the playlist" }),
        songId: t.String({
          description: "The ID of the song to remove from the playlist",
        }),
      }),
      detail: {
        summary: "Remove a song from a playlist",
        description: "Remove a specific song from a playlist",
      },
    },
  );
