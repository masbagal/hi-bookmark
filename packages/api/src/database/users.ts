import { eq } from "drizzle-orm";
import db, { APIResponse } from "./db";
import { sessionTable, usersTable } from "./schema";
import { Context } from "hono";
import { generateJWTToken, generateSessionId } from "../utils/authUtils";
import { User } from "schema/auth";

function returnInvalidCredentialError(message: string) {
  return {
    status: "ERROR",
    message,
  } as APIResponse;
}

/** Register new user, this should also log in the user but not yet created */
export async function createNewUser(user: User) {
  await db.insert(usersTable).values(user);
  const returnedUser = { ...user } as Partial<User>;
  delete returnedUser.password;
  return returnedUser as Omit<User, "password">;
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
    throw new Error("Invalid username or password");
  }

  const userEntry = userEntries[0];

  const isPasswordMatch = await Bun.password.verify(
    user.password,
    userEntry.password
  );

  if (!isPasswordMatch) throw new Error("Invalid username or password");

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

  return token;
}

export async function signOutUser() {}
