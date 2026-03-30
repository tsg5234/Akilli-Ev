import "server-only";

import { cookies } from "next/headers";
import { jwtVerify, SignJWT, type JWTPayload } from "jose";
import { env } from "@/lib/env";

const COOKIE_NAME = "evprogram-parent-session";
const MAX_AGE = 60 * 60 * 24 * 14;
const secret = new TextEncoder().encode(env.sessionSecret);

export interface ParentSession extends JWTPayload {
  familyId: string;
  role: "ebeveyn";
}

export async function createParentSession(session: ParentSession) {
  const token = await new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret);

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE,
    path: "/"
  });
}

export async function getParentSession(): Promise<ParentSession | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload as ParentSession;
  } catch {
    return null;
  }
}

export async function clearParentSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function requireParentSession() {
  const session = await getParentSession();

  if (!session) {
    throw new Error("Bu işlem için ebeveyn girişi gerekli.");
  }

  return session;
}
