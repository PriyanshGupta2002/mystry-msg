import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDb } from "@/lib/dbConnect";
import userModel from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@gmail.com",
        },
        username: {
          label: "Username",
          type: "text",
          placeholder: "jsmith",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        try {
          await connectToDb();
          const user = await userModel.findOne({
            $or: [
              { email: credentials?.email },
              { username: credentials?.username },
            ],
          });
          if (!user) {
            throw new Error("No user found");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your account");
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials?.password!,
            user.password
          );
          if (!isPasswordCorrect) {
            throw new Error("Incorrect Password");
          }
          return user;
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        (session.user.isVerified = token.isVerified),
          (session.user.isAcceptingMessage = token.isAcceptingMessage),
          (session.user.username = token.username);
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        (token._id = user._id?.toString()),
          (token.username = user.username),
          (token.isVerified = user.isVerified),
          (token.isAcceptingMessage = user.isAcceptingMessage);
      }
      return token;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
