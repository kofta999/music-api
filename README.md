# Music Streaming API

This is a feature-rich music streaming API built with [Elysia](https://elysia.js.org/), a lightweight and fast web framework for Node.js. The API provides endpoints for user authentication, song search and streaming, playlist management, and artist following.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [ERD Diagram](#erd-diagram)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Songs](#songs)
  - [Playlists](#playlists)
  - [Artists](#artists)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Sign up and sign in with JWT-based authentication.
- **Song Management**: Search for songs, retrieve song details, and stream songs.
- **Playlist Management**: Create, update, delete, and manage playlists.
- **Artist Management**: Follow and unfollow artists, and view artist profiles.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/music-api.git
   cd music-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the database using Prisma:

   ```bash
   npx prisma migrate dev --name init
   ```

4. Start the server:

   ```bash
   npm start
   ```

   The server will be running at `http://localhost:3000`.

## Usage

You can interact with the API using tools like [Postman](https://www.postman.com/) or [curl](https://curl.se/). The API documentation is available at `http://localhost:3000/swagger`.


## ERD Diagram



## API Endpoints

### Authentication

- **Sign Up**

  ```http
  POST /api/auth/sign-up
  ```

  Request Body:

  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }
  ```

- **Sign In**

  ```http
  POST /api/auth/sign-in
  ```

  Request Body:

  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### Songs

- **Search Songs**

  ```http
  GET /api/songs/search?query=love&page=1
  ```

- **Get Song Details**

  ```http
  GET /api/songs/:publicId
  ```

- **Stream Song**

  ```http
  GET /api/songs/:publicId/stream
  ```

### Playlists

- **Get Playlist**

  ```http
  GET /api/playlists/:publicId
  ```

- **Create Playlist**

  ```http
  POST /api/playlists
  ```

  Request Body:

  ```json
  {
    "name": "My Playlist",
    "description": "A collection of my favorite songs",
    "songs": ["songId1", "songId2"]
  }
  ```

- **Update Playlist**

  ```http
  PUT /api/playlists/:publicId
  ```

  Request Body:

  ```json
  {
    "name": "Updated Playlist Name",
    "description": "Updated description"
  }
  ```

- **Delete Playlist**

  ```http
  DELETE /api/playlists/:publicId
  ```

- **Add Song to Playlist**

  ```http
  POST /api/playlists/:publicId/songs
  ```

  Request Body:

  ```json
  {
    "songId": "songId1"
  }
  ```

- **Remove Song from Playlist**

  ```http
  DELETE /api/playlists/:publicId/songs/:songId
  ```

### Artists

- **Get Artist Profile**

  ```http
  GET /api/artists/:publicId
  ```

- **Follow/Unfollow Artist**

  ```http
  PUT /api/artists/:publicId
  ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

```

Feel free to customize the `README.md` file further based on your specific needs and preferences.
```
