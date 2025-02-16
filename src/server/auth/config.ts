import { PrismaAdapter } from "@auth/prisma-adapter"; 
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";
import { db } from "~/server/db";
import { compare } from "bcryptjs";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
    } & DefaultSession["user"];
  }
}

export const authConfig = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt", // Store sessions in the database
  },
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "your@example.com" },
        password: { label: "Password", type: "password", placeholder: "******" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) {
          throw new Error("Email and Password are required");
        }

        const user = await db.user.findUnique({ where: { email } });

        if (!user?.hashedPassword) {
          throw new Error("Invalid email or password");
        }

        const isValidPassword = await compare(password, user.hashedPassword);

        if (!isValidPassword) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.exp = Math.floor(Date.now() / 1000) + 60 * 1; // 60 seconds = 1 minute
        // Expires in 24 hours
    }
      
      return token;
    },
  
    async session({ session, token }) {
      
      const userId = token.id as string; // Ensure it's a string
  
      if (!userId) return session;
  
      const freshUser = await db.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          emailVerified: true, // ✅ Add this line
        },
      });
  
      if (freshUser) {
        session.user = {
          ...freshUser, // ✅ Includes emailVerified
          email: freshUser.email ?? "", // Ensure it's always a string
        };
      }
  
      return session;
    },
  },
  
  
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.AUTH_SECRET,
  trustHost:true
} satisfies NextAuthConfig;