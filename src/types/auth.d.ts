import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      employee: {
        id:number;
        gender: string;
        department: any;
        permission: any;
        super: string;
        jobPosition?: {
          jobPositionGroup?: {
            id: number;
            name: string;
            jobAuthRank:number
          };
        };
        super: string;
      };
      name?: string | null;
      email?: string | null;
      image?: string | null;
      mobile?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    mobile?: string | null;
    employee: {
      jobPosition?: {
        jobPositionGroup?: {
          id: number;
          name: string;
        };
      };
      super: string;
    };
  }
}
