import Elysia, { t } from "elysia";
import prisma from "../../lib/db";

export const songsController = new Elysia({ prefix: "/songs" })
  .decorate("prisma", prisma)
  .get(
    "/search",
    async ({ query: { query }, prisma }) => {
      // TODO: Pagination

      const results = await prisma.song.findMany({
        where: {
          // TODO: Add search by artist etc
          OR: [{ title: { contains: query } }],
        },
        take: 10,
      });

      return { results };
    },
    {
      query: t.Object({
        query: t.String(),
      }),
    },
  )
  .get("/:id", async ({ params: { id }, prisma, error }) => {
    // TODO: Add more fetch details
    const song = await prisma.song.findUnique({ where: { id } });

    if (!song) {
      return error("Not Found");
    }

    return song;
  })
  .get("/:id/stream", async function ({ request, params, set }) {
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
  });
