import { eq } from "drizzle-orm";
import db, { APIResponse } from "./db";
import { sessionTable, usersTable } from "./schema";
import { sign } from "hono/jwt";
import { setCookie } from "hono/cookie";
import { Context } from "hono";

export type User = {
  name: string;
  email: string;
  password: string;
};

export type TokenPayload = {
  name: string;
  email: string;
  userId: number;
  exp: number;
};

function returnInvalidCredentialError(message: string) {
  return {
    status: "ERROR",
    message,
  } as APIResponse;
}

/** Register new user, this should also log in the user but not yet created */
export async function createNewUser(user: User) {
  try {
    await db.insert(usersTable).values(user);
  } catch (error) {
    console.log(error);
    return returnInvalidCredentialError(
      "There's a problem in registering this user"
    );
  }

  const returnedUser = { ...user };
  returnedUser.password = "";
  return {
    status: "SUCCESS",
    message: "User successfully registered!",
    data: returnedUser,
  } as APIResponse;
}

/** Sign in user and create token */
export async function signInUser(c: Context, user: Omit<User, "name">) {
  const userEntries = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, user.email));

  if (!userEntries || userEntries.length === 0) {
    return returnInvalidCredentialError("Invalid username or password");
  }

  const userEntry = userEntries[0];
  const isPasswordMatch = await Bun.password.verify(
    user.password,
    userEntry.password
  );

  if (!isPasswordMatch)
    return returnInvalidCredentialError("Invalid username or password");

  const jwtTokenExpiry = Math.floor(Date.now() / 1000) + 60 * 15; // Token expires in 5 minutes
  const refreshTokenExpiry = Math.floor(Date.now() / 1000) + 60 * 60 * 1; // Token expires in 1 hour
  const sessionId = crypto.randomUUID();
  const payload: TokenPayload = {
    name: userEntry.name,
    email: user.email,
    userId: userEntry.id,
    exp: jwtTokenExpiry,
  };

  const token = await sign(payload, Bun.env.JWT_SECRET as string);

  // db.insert(sessionTable).values({
  //   id: sessionId,
  //   user_id: userEntry.id,
  //   expires_at: refreshTokenExpiry,
  // });

  setCookie(c, "refresh-token", token, {
    httpOnly: true,
    sameSite: "Strict",
    maxAge: 30 * 24 * 60 * 60,
  });

  return {
    status: "SUCCESS",
    message: "User successfully logged-in!",
    data: {
      name: userEntry.name,
      email: userEntry.email,
      token,
    },
  } as APIResponse;
}

export async function signOutUser() {}
