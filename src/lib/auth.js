import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createOrUpdateUser } from "../../lib/userService.js";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Add user ID to the session and ensure image is passed through
      session.user.id = token.sub;
      if (token.picture) {
        session.user.image = token.picture;
      }

      // Add database user info to session if available
      if (token.dbUser) {
        session.user.dbUser = token.dbUser;
        session.user.isNewUser = token.isNewUser;
      }

      return session;
    },
    async jwt({ token, user, account }) {
      // Persist the OAuth data to the token right after signin
      if (user && account) {
        // This runs on first sign-in - create or update user in Supabase
        try {
          const userData = {
            googleId: user.id, // Google user ID
            email: user.email,
            name: user.name,
            imageUrl: user.image,
          };

          const { user: dbUser, isNewUser } = await createOrUpdateUser(
            userData
          );

          // Add database user info to token
          token.dbUser = dbUser;
          token.isNewUser = isNewUser;

          if (isNewUser) {
            console.log("🎉 First-time login detected for user:", user.email);
          }
        } catch (error) {
          console.error("❌ Error creating/updating user:", error.message);
          // Continue with login even if database operation fails
        }

        token.id = user.id;
        token.picture = user.image;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin", // Optional: custom sign-in page
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
