// types/next-auth.d.ts or anywhere inside your project (ensure tsconfig includes it)

import { DefaultSession} from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email:string;
      username: string;
      isVerified: boolean;
      isAcceptingMessage: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email:string;
    username: string;
    isVerified: boolean;
    isAcceptingMessage: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email:string;
    username: string;
    isVerified: boolean;
    isAcceptingMessage: boolean;
  }
}
