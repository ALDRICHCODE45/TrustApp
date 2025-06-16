import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./db";
import { LogAction, UserState } from "@prisma/client";

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
          user.State === UserState.INACTIVO
        ) {
          // No user found, so this is their first attempt to login
          throw new InvalidLoginError();
        }
        await prisma.log.create({
          data: {
            action: LogAction.Ingresar,
            autorId: user.id,
          },
        });
        // return user object with their profile data
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 horas (1 día)
    updateAge: 60 * 60, // Actualizar cada hora
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
      if (token) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
});
