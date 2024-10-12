import { Elysia } from "elysia";
import prisma from "../../lib/db";
import { authorizer } from "../auth";

export const artistsController = new Elysia({
  prefix: "/artists",
  tags: ["Artists"],
})
  .decorate("prisma", prisma)
  .get("/:publicId", async ({ params: { publicId }, prisma, error }) => {
    // TODO: Add a way to return if the user is following that artist
    // Artist's songs should be fetched from the songs endpoint with a query param instead
    const artist = await prisma.artist.findUnique({
      where: { publicId },
      select: {
        bio: true,
        name: true,
        imageUrl: true,
        _count: { select: { followers: true, albums: true, songs: true } },
      },
    });

    if (!artist) {
      return error("Not Found");
    }

    const { bio, imageUrl, name, _count } = artist;

    return {
      name,
      bio,
      imageUrl,
      songsCount: _count.songs,
      followersCount: _count.followers,
      albumsCount: _count.albums,
    };
  })
  .use(authorizer)
  .put(
    "/:publicId",
    async ({ params: { publicId }, prisma, error, userId, set }) => {
      const artist = await prisma.artist.findUnique({
        where: { id: publicId },
      });

      if (!artist) {
        return error("Not Found");
      }

      const result = await prisma.follow.deleteMany({
        where: { userId, artistId: publicId },
      });

      if (result.count == 0) {
        await prisma.follow.create({
          data: { artistId: publicId, userId },
        });

        set.status = "Created";
      } else {
        set.status = "No Content";
      }
    },
  );
