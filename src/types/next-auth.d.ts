import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      email:string;
      username: string;
      isVerified: boolean;
      isAcceptingMessage:boolean;
    } & DefaultSession["user"];
  }

  interface User {
    _id: string;
    username: string;
    email: string;
    password: string;
    isVerified: boolean;
    isAcceptingMessage: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id: string;
    username: string;
    isVerified: boolean;
    isAcceptingMessage: boolean;
  }
}
