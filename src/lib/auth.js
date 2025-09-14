import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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
      return session;
    },
    async jwt({ token, user, account }) {
      // Persist the OAuth data to the token right after signin
      if (user) {
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
