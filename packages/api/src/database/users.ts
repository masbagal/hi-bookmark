import { eq } from "drizzle-orm";
import db, { APIResponse } from "./db";
import { sessionTable, usersTable } from "./schema";
import { sign } from "hono/jwt";
import { setCookie } from "hono/cookie";
import { Context } from "hono";
import { generateJWTToken, generateSessionId } from "../utils/authUtils";

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};

function returnInvalidCredentialError(message: string) {
  return {
    status: "ERROR",
    message,
  } as APIResponse;
}

/** Register new user, this should also log in the user but not yet created */
export async function createNewUser(user: Omit<User, "id">) {
  try {
    await db.insert(usersTable).values(user);
  } catch (error) {
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
export async function signInUser(
  c: Context,
  user: Pick<User, "email" | "password">
) {
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

  const refreshTokenExpiry = Math.floor(Date.now()) + 60 * 60 * 1; // Token expires in 1 hour
  const sessionId = generateSessionId() as string;
  const token = await generateJWTToken(sessionId, userEntry);

  await db.insert(sessionTable).values({
    //@ts-ignore
    id: sessionId,
    user_id: userEntry.id,
    created_at: Date.now(),
    expires_at: refreshTokenExpiry,
  });

  c.header("X-Access-Token", token);

  return {
    status: "SUCCESS",
    message: "User successfully logged-in!",
    data: {
      name: userEntry.name,
      email: userEntry.email,
    },
  } as APIResponse;
}

export async function signOutUser() {}
