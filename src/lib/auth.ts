import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "./db";

class InvalidLoginError extends CredentialsSignin {
  code = "Invalid identifier or password";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null;

        // logic to verify if the user exists
        user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (
          !user ||
          !bcrypt.compareSync(credentials.password as string, user.password) ||
          user.State === "INACTIVO"
        ) {
          // No user found, so this is their first attempt to login
          throw new InvalidLoginError();
        }
        // return user object with their profile data
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role as string;
      session.user.id = token.id as string;

      return session;
    },
  },
});
