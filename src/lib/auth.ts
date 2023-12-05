import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { dbRedis, dbPrisma } from "./db";

import { compare } from "bcrypt";

import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
//import { PrismaAdapter } from "@next-auth/prisma-adapter";

function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || clientId.length === 0) {
    throw new Error("Missing GOOGLE_CLIENT_ID");
  }
  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("Missing GOOGLE_SECRET");
  }

  return { clientId, clientSecret };
}

export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(dbRedis),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    GoogleProvider({
      clientId: getGoogleCredentials().clientId,
      clientSecret: getGoogleCredentials().clientSecret,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "johndoe@email.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const existingUser = await dbPrisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (!existingUser) {
          return null;
        }

        const passwordMatch = await compare(
          credentials.password,
          existingUser.password
        );

        if (!passwordMatch) {
          return null;
        }

        return {
          id: `${existingUser.id}`,
          username: existingUser.username,
          email: existingUser.email,
        };
      },
    }),
  ],
  callbacks: 
  {
    async jwt({ token, user}){
      
      if(user){
        return {
          ...token,
          username: user.username
        }
      }
      
      return token

    },

    async session({session, token}){
      return{
        ...session,
        user: {
          ...session.user,
          username: token.username
        }
      }
    },
    redirect(){
      return"/dashboard";
    }
  }
};


/** CALLBACKS FROM GOOGLE PROVIDER 
  { async jwt({ token, user }) {
      const dbUser = (await db.get(`user:${token.id}`)) as User | null;

      if (!dbUser) {
        token.id = user!.id;
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session
    },
    redirect(){
      return '/dashboard'
    }
  }
 */

  /** CALLBACKS FROM CREDENTIALS
   {
    async jwt({ token, user}){
    
      if(user){
        return {
          ...token,
          username: user.username
        }
      }
      
      return token

    },

    async session({session, token}){
      return{
        ...session,
        user: {
          ...session.user,
          username: token.username
        }
      }
    },
    redirect(){
      return"/dashboard";
    }
  }

  */