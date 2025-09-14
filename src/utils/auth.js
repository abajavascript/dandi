import { getServerSession } from "next-auth/next";
import { authOptions } from "../lib/auth";

/**
 * Get the current session on the server side
 * @returns {Promise<Session|null>}
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Check if the user is authenticated on the server side
 * @returns {Promise<boolean>}
 */
export async function isAuthenticated() {
  const session = await getSession();
  return !!session?.user;
}

/**
 * Get the current user from the session
 * @returns {Promise<User|null>}
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}

/**
 * Middleware to protect routes - redirect to signin if not authenticated
 * @param {NextRequest} request
 * @returns {NextResponse}
 */
export function withAuth(handler) {
  return async function (request, response) {
    const session = await getSession();

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    return handler(request, response);
  };
}
