import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

const artists = [
  {
    publicId: nanoid(21),
    name: "The Melodic Waves",
    bio: "An indie rock band known for their atmospheric sounds and introspective lyrics.",
    imageUrl: "http://localhost:3000/public/default.png",
  },
  {
    publicId: nanoid(21),
    name: "Elettra",
    bio: "Electronic music producer pushing the boundaries of synth-pop.",
    imageUrl: "http://localhost:3000/public/default.png",
  },
  {
    publicId: nanoid(21),
    name: "Jazz Collective",
    bio: "A group of seasoned jazz musicians known for their improvisational skills.",
    imageUrl: "http://localhost:3000/public/default.png",
  },
];

// Albums
const albums = [
  {
    publicId: nanoid(21),
    title: "Echoes of Tomorrow",
    artistId: 1, // Assuming the first artist will have ID 1
    releaseDate: new Date("2022-03-15"),
    coverArt: "http://localhost:3000/public/default.png",
  },
  {
    publicId: nanoid(21),
    title: "Neon Dreams",
    artistId: 2, // Assuming the second artist will have ID 2
    releaseDate: new Date("2023-07-22"),
    coverArt: "http://localhost:3000/public/default.png",
  },
  {
    publicId: nanoid(21),
    title: "Midnight Sessions",
    artistId: 3, // Assuming the third artist will have ID 3
    releaseDate: new Date("2021-11-30"),
    coverArt: "http://localhost:3000/public/default.png",
  },
];

// Songs
const songs = [
  {
    publicId: nanoid(21),
    title: "Whispers in the Wind",
    artistId: 1, // Assuming the first artist will have ID 1
    albumId: 1, // Assuming the first album will have ID 1
    duration: 245, // 4:05
    genre: "Indie Rock",
    releaseDate: new Date("2022-03-15"),
    audioUrl: "http://localhost:3000/public/song.mp3",
    coverArt: "http://localhost:3000/public/default.png",
  },
  {
    publicId: nanoid(21),
    title: "Neon Nights",
    artistId: 2, // Assuming the second artist will have ID 2
    albumId: 2, // Assuming the second album will have ID 2
    duration: 198, // 3:18
    genre: "Electronic",
    releaseDate: new Date("2023-07-22"),
    audioUrl: "http://localhost:3000/public/song.mp3",
    coverArt: "http://localhost:3000/public/default.png",
  },
  {
    publicId: nanoid(21),
    title: "Blue Moon Serenade",
    artistId: 3, // Assuming the third artist will have ID 3
    albumId: 3, // Assuming the third album will have ID 3
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
