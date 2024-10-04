import Elysia, { t } from "elysia";
import prisma from "../../lib/db";

const songsController = new Elysia({ prefix: "/songs" })
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
  .get("/:id/stream", ({}) => {});
