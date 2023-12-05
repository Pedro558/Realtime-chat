import type { Session, User } from "next-auth";
import type { JWT } from "next-auth";

type UserId = string;

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
  }
}

declare module "next-auth" {
  interface User{
    username:string;
  }

  interface Session {
    user: User & {
      username: string;
      id: UserId;
    };
    token:{
      username:string
    }
  }
}
