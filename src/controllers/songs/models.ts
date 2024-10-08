import { t } from "elysia";

const songDetails = t.Object({
  publicId: t.String(),
  title: t.String(),
  duration: t.Number(),
  genre: t.Union([t.String(), t.Null()]),
  releaseDate: t.Date(),
  coverArt: t.Union([t.String(), t.Null()]),
  artist: t.Union([
    t.Object({
      publicId: t.String(),
      name: t.String(),
      // OPTIONAL: Add image URL
    }),
    t.Null(),
  ]),
  album: t.Union([
    t.Object({
      publicId: t.String(),
      title: t.String(),
    }),
    t.Null(),
  ]),
});

export const SongModels = {
  searchQuery: t.Object({
    query: t.String({ description: "Search query for song titles" }),
    page: t.Number({ default: 1 }),
  }),
  songId: t.Object({
    id: t.String({ description: "The ID of the song" }),
  }),
  streamHeaders: t.Object({
    range: t.Optional(
      t.String({
        description: "Range header for partial content requests",
      }),
    ),
  }),
  songDetails,
  searchResults: t.Array(songDetails),
};
