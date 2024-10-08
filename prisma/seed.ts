import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

const artists = [
  {
    id: "a1b2c3d4-e5f6-4321-8765-9abc87654321",
    publicId: nanoid(21),
    name: "The Melodic Waves",
    bio: "An indie rock band known for their atmospheric sounds and introspective lyrics.",
    imageUrl: "http://localhost:3000/public/default.png",
  },
  {
    id: "b2c3d4e5-f6a7-5432-8765-0bcd98765432",
    publicId: nanoid(21),
    name: "Elettra",
    bio: "Electronic music producer pushing the boundaries of synth-pop.",
    imageUrl: "http://localhost:3000/public/default.png",
  },
  {
    id: "c3d4e5f6-a7b8-6543-8765-1cde09876543",
    publicId: nanoid(21),
    name: "Jazz Collective",
    bio: "A group of seasoned jazz musicians known for their improvisational skills.",
    imageUrl: "http://localhost:3000/public/default.png",
  },
];

// Albums
const albums = [
  {
    id: "d4e5f6a7-b8c9-7654-8765-2def10987654",
    publicId: nanoid(21),
    title: "Echoes of Tomorrow",
    artistId: "a1b2c3d4-e5f6-4321-8765-9abc87654321",
    releaseDate: new Date("2022-03-15"),
    coverArt: "http://localhost:3000/public/default.png",
  },
  {
    id: "e5f6a7b8-c9d0-8765-8765-3efg21098765",
    publicId: nanoid(21),
    title: "Neon Dreams",
    artistId: "b2c3d4e5-f6a7-5432-8765-0bcd98765432",
    releaseDate: new Date("2023-07-22"),
    coverArt: "http://localhost:3000/public/default.png",
  },
  {
    id: "f6a7b8c9-d0e1-9876-8765-4ghi32109876",
    publicId: nanoid(21),
    title: "Midnight Sessions",
    artistId: "c3d4e5f6-a7b8-6543-8765-1cde09876543",
    releaseDate: new Date("2021-11-30"),
    coverArt: "http://localhost:3000/public/default.png",
  },
];

// Songs
const songs = [
  {
    id: "g7h8i9j0-k1l2-0987-8765-5hij43210987",
    publicId: nanoid(21),
    title: "Whispers in the Wind",
    artistId: "a1b2c3d4-e5f6-4321-8765-9abc87654321",
    albumId: "d4e5f6a7-b8c9-7654-8765-2def10987654",
    duration: 245, // 4:05
    genre: "Indie Rock",
    releaseDate: new Date("2022-03-15"),
    audioUrl: "http://localhost:3000/public/song.mp3",
    coverArt: "http://localhost:3000/public/default.png",
  },
  {
    id: "h8i9j0k1-l2m3-1098-8765-6ijk54321098",
    publicId: nanoid(21),
    title: "Neon Nights",
    artistId: "b2c3d4e5-f6a7-5432-8765-0bcd98765432",
    albumId: "e5f6a7b8-c9d0-8765-8765-3efg21098765",
    duration: 198, // 3:18
    genre: "Electronic",
    releaseDate: new Date("2023-07-22"),
    audioUrl: "http://localhost:3000/public/song.mp3",
    coverArt: "http://localhost:3000/public/default.png",
  },
  {
    id: "i9j0k1l2-m3n4-2109-8765-7jkl65432109",
    publicId: nanoid(21),
    title: "Blue Moon Serenade",
    artistId: "c3d4e5f6-a7b8-6543-8765-1cde09876543",
    albumId: "f6a7b8c9-d0e1-9876-8765-4ghi32109876",
    duration: 312, // 5:12
    genre: "Jazz",
    releaseDate: new Date("2021-11-30"),
    audioUrl: "http://localhost:3000/public/song.mp3",
    coverArt: "http://localhost:3000/public/default.png",
  },
];

async function main() {
  // Seed Artists
  for (const artist of artists) {
    await prisma.artist.create({
      data: artist,
    });
  }
  console.log("Artists seeded");

  // Seed Albums
  for (const album of albums) {
    await prisma.album.create({
      data: album,
    });
  }
  console.log("Albums seeded");

  // Seed Songs
  for (const song of songs) {
    await prisma.song.create({
      data: song,
    });
  }
  console.log("Songs seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
