import "server-only";

import { cookies } from "next/headers";
import { jwtVerify, SignJWT, type JWTPayload } from "jose";
import { env } from "@/lib/env";

const COOKIE_NAME = "evprogram-app-session";
const LEGACY_COOKIE_NAME = "evprogram-parent-session";
const MAX_AGE = 60 * 60 * 24 * 14;
const secret = new TextEncoder().encode(env.sessionSecret);

export interface AppSession extends JWTPayload {
  accountId: string;
  username: string;
  familyId: string | null;
  accessToken: string;
  refreshToken: string;
  parentAuthenticated: boolean;
  role: "ebeveyn" | null;
}

interface SessionInput extends JWTPayload {
  accountId: string;
  username: string;
  familyId: string | null;
  accessToken: string;
  refreshToken: string;
  parentAuthenticated: boolean;
  role: "ebeveyn" | null;
}

async function writeSession(session: SessionInput) {
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
  store.delete(LEGACY_COOKIE_NAME);
}

export async function createAccountSession(session: {
  accountId: string;
  username: string;
  familyId: string | null;
  accessToken: string;
  refreshToken: string;
}) {
  await writeSession({
    ...session,
    parentAuthenticated: false,
    role: null
  });
}

export async function updateSessionFamily(session: AppSession, familyId: string) {
  await writeSession({
    accountId: session.accountId,
    username: session.username,
    familyId,
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    parentAuthenticated: false,
    role: null
  });
}

export async function grantParentAccess(session: AppSession & { familyId: string }) {
  await writeSession({
    accountId: session.accountId,
    username: session.username,
    familyId: session.familyId,
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    parentAuthenticated: true,
    role: "ebeveyn"
  });
}

export async function getAppSession(): Promise<AppSession | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload as AppSession;
  } catch {
    return null;
  }
}

export async function requireAccountSession() {
  const session = await getAppSession();

  if (!session) {
    throw new Error("Bu işlem için hesap girişi gerekli.");
  }

  return session;
}

export async function requireFamilySession() {
  const session = await requireAccountSession();

  if (!session.familyId) {
    throw new Error("Once aile kurulumunu tamamlayin.");
  }

  return session as AppSession & { familyId: string };
}

export async function clearParentSession() {
  const session = await getAppSession();

  if (!session) {
    return;
  }

  await writeSession({
    accountId: session.accountId,
    username: session.username,
    familyId: session.familyId,
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    parentAuthenticated: false,
    role: null
  });
}

export async function clearAppSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
  store.delete(LEGACY_COOKIE_NAME);
}

export async function requireParentSession() {
  const session = await requireFamilySession();

  if (!session.parentAuthenticated || session.role !== "ebeveyn") {
    throw new Error("Bu işlem için ebeveyn PIN girişi gerekli.");
  }

  return session;
}
