import { Elysia, t } from "elysia";
import prisma from "../../lib/db";
import jwt from "@elysiajs/jwt";

const signUpModel = t.Object({
  email: t.String({ description: "User's email address" }),
  password: t.String({ description: "User's password" }),
  name: t.String({ description: "User's full name" }),
});

const jwtController = new Elysia({ name: "jwtController" }).use(
  jwt({
    name: "jwt",
    secret: "test",
    schema: t.Object({ sub: t.String() }),
    exp: "1h",
  }),
);

export const authorizer = new Elysia({
  name: "user/auth",
})
  .use(jwtController)
  .resolve({ as: "scoped" }, async ({ headers, jwt, error }) => {
    const authHeader = headers.authorization;

    if (!authHeader) {
      return error("Unauthorized");
    }

    const splitHeader = authHeader.split(" ");

    if (
      splitHeader[0].toLowerCase() !== "bearer" ||
      splitHeader[1].length === 0
    ) {
      return error("Unauthorized");
    }

    let result = await jwt.verify(splitHeader[1]);

    if (!result) {
      return error("Unauthorized");
    }

    return { userId: result.sub };
  });

export const authController = new Elysia({
  prefix: "/auth",
  tags: ["Authentication"],
})
  .use(jwtController)
  .decorate("prisma", prisma)
  .model("sign-up", signUpModel)
  .model("sign-in", t.Omit(signUpModel, ["name"]))
  .post(
    "/sign-up",
    async ({ body: { email, name, password }, error, prisma, set }) => {
      const isUserExist = await prisma.user.findUnique({ where: { email } });

      if (isUserExist) {
        return error("Conflict");
      }

      password = await Bun.password.hash(password);

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password,
        },
        select: { id: true },
      });

      set.status = "Created";

      return { userId: newUser.id };
    },
    {
      body: "sign-up",
      detail: {
        summary: "Register a new user",
        description: "Create a new user account with email, password, and name",
        tags: ["Authentication"],
      },
    },
  )
  .post(
    "/sign-in",
    async ({ body: { email, password }, error, prisma, jwt }) => {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return error("Unauthorized");
      }

      const isValidPassword = await Bun.password.verify(
        password,
        user.password,
      );

      if (!isValidPassword) {
        return error("Unauthorized");
      }

      const token = await jwt.sign({ sub: user.id });

      return { token };
    },
    {
      body: "sign-in",
      detail: {
        summary: "Authenticate a user",
        description:
          "Authenticate a user with email and password, and return a JWT token",
        tags: ["Authentication"],
      },
    },
  );
