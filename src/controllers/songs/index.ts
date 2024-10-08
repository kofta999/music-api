import Elysia, { t } from "elysia";
import prisma from "../../lib/db";
import { authorizer } from "../auth";
import { SongModels } from "./models";

export const songsController = new Elysia({
  prefix: "/songs",
  detail: {
    tags: ["Songs"],
    description: "Endpoints for searching, retrieving, and streaming songs",
  },
})
  .decorate("prisma", prisma)
  .model(SongModels)
  .get(
    "/search",
    async ({ query: { query, page }, prisma }) => {
      const results = await prisma.song.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { artist: { name: { contains: query } } },
            { album: { title: { contains: query } } },
          ],
        },
        skip: 10 * (page - 1),
        take: 10,
        select: {
          publicId: true,
          title: true,
          duration: true,
          genre: true,
          releaseDate: true,
          coverArt: true,
          artist: {
            select: {
              publicId: true,
              name: true,
            },
          },
          album: {
            select: {
              publicId: true,
              title: true,
            },
          },
        },
      });

      return results;
    },
    {
      query: "searchQuery",
      response: {
        200: "searchResults",
        400: t.String(),
      },
      detail: {
        summary: "Search for songs",
        description: "Search for songs based on a query string",
      },
    },
  )
  .get(
    "/:id",
    async ({ params: { id }, prisma, error }) => {
      const song = await prisma.song.findUnique({
        where: { id },
        select: {
          publicId: true,
          title: true,
          duration: true,
          genre: true,
          releaseDate: true,
          coverArt: true,
          artist: {
            select: {
              publicId: true,
              name: true,
            },
          },
          album: {
            select: {
              publicId: true,
              title: true,
            },
          },
        },
      });

      if (!song) {
        return error(404, "Song with ID does not exist");
      }

      return song;
    },
    {
      params: "songId",
      response: {
        200: "songDetails",
        404: t.String(),
      },
      detail: {
        summary: "Get a song by ID",
        description: "Retrieve detailed information about a specific song",
      },
    },
  )
  .get(
    "/:id/stream",
    async function ({ request, params, set }) {
      const CHUNK_SIZE = 256 * 1024;
      const songId = params.id;
      const audioUrl = `./public/${songId}.mp3`;
      const file = Bun.file(audioUrl);

      if (!file.exists()) {
        set.status = 404;
        return "File not found";
      }

      const size = file.size;
      const range = request.headers.get("range");

      let start = 0;
      let end = size - 1;

      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        start = parseInt(parts[0], 10);
        end = parts[1]
          ? parseInt(parts[1], 10)
          : Math.min(start + CHUNK_SIZE - 1, size - 1);
      } else {
        end = Math.min(CHUNK_SIZE - 1, size - 1);
      }

      start = Math.max(0, Math.min(start, size - 1));
      end = Math.max(start, Math.min(end, size - 1));

      if (
        isNaN(start) ||
        isNaN(end) ||
        start >= size ||
        end >= size ||
        start > end
      ) {
        set.status = "Range Not Satisfiable";
        set.headers["Content-Range"] = `bytes */${size}`;
        return "Invalid range";
      }

      if (end - start + 1 <= 0) {
        set.status = "Range Not Satisfiable";
        set.headers["Content-Range"] = `bytes */${size}`;
        return "Invalid range";
      }

      set.status = "Partial Content";
      set.headers["content-range"] = `bytes ${start}-${end - 1}/${size}`;
      set.headers["accept-ranges"] = "bytes";

      console.log(`Streaming range: ${start}-${end}/${size}`);

      return new Response(file.slice(start, end));
    },
    {
      params: "songId",
      headers: "streamHeaders",
      detail: {
        summary: "Stream a song",
        description:
          "Stream the audio file of a song, supporting partial content requests",
        responses: {
          206: {
            description: "Partial Content",
            headers: {
              "Content-Range": { schema: { type: "string" } },
              "Accept-Ranges": { schema: { type: "string" } },
            },
            content: {
              "audio/mpeg": {
                schema: {
                  type: "string",
                  format: "binary",
                },
              },
            },
          },
          404: { description: "File not found" },
          416: { description: "Range Not Satisfiable" },
        },
      },
    },
  )
  .use(authorizer)
  .post(":id/record", async ({ params: { id }, userId }) => {
    // TODO
  });
