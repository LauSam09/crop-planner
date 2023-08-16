import { createCookieSessionStorage, redirect } from "@remix-run/node";

import {
  adminAuth,
  getSessionToken,
  signOutFirebase,
} from "~/utils/firebase.server";

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
  throw new Error("Session secret not defined");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 10, // Firebase auth expires in 14 days and I'm not
    // sure how to configure this currently.
    httpOnly: true,
  },
});

export async function createUserSession(idToken: string, redirectTo: string) {
  const token = await getSessionToken(idToken);
  const session = await storage.getSession();
  session.set("token", token);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export async function getUserSession(request: Request) {
  const cookieSession = await storage.getSession(request.headers.get("Cookie"));
  const token = cookieSession.get("token");
  if (!token) {
    return null;
  }

  try {
    return await adminAuth.verifySessionCookie(token, true);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function requireUserSession(request: Request) {
  const session = await getUserSession(request);

  if (!session) {
    throw redirect("/login");
  }

  return session;
}

export async function destroySession(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  const newCookie = await storage.destroySession(session);

  return redirect("/login", { headers: { "Set-Cookie": newCookie } });
}

export async function signOut(request: Request) {
  await signOutFirebase();
  return await destroySession(request);
}
