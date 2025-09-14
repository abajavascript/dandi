import { withAuth } from "next-auth/middleware";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    console.log("Middleware - token:", req.nextauth.token);
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/", // Redirect to home page to sign in
    },
  }
);

// Apply middleware to these routes
export const config = {
  matcher: [
    "/auth-protected/:path*", // Protect the Google SSO demo page
    "/dashboards/:path*", // Protect dashboard routes
    "/playground/:path*", // Protect playground routes
  ],
};
