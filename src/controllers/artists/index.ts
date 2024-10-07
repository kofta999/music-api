import { Elysia } from "elysia";
import prisma from "../../lib/db";
import { authorizer } from "../auth";

export const artistsController = new Elysia({ prefix: "/artists" })
  .decorate("prisma", prisma)
  .get("/:id", async ({ params: { id }, prisma, error }) => {
    // TODO: Add songs too
    // TODO: Add a way to return if the user is following that artist
    const artist = await prisma.artist.findUnique({ where: { id } });

    if (!artist) {
      return error("Not Found");
    }

    return { artist };
  })
  .use(authorizer)
  .put("/:id", async ({ params: { id }, prisma, error, userId, set }) => {
    const artist = await prisma.artist.findUnique({ where: { id } });

    if (!artist) {
      return error("Not Found");
    }

    const result = await prisma.follow.deleteMany({
      where: { userId, artistId: id },
    });

    if (result.count == 0) {
      await prisma.follow.create({
        data: { artistId: id, userId },
      });

      set.status = "Created";
    } else {
      set.status = "No Content";
    }
  });
