import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      employee: {
        jobPosition?: {
          jobPositionGroup?: {
            id: number;
            name: string;
          };
        };
        departmentEmployeeRole?: {
          rode: boolean;
        }[];
        super: string;
      };
      name?: string | null;
      email?: string | null;
      image?: string | null;
      mobile?: string | null;
      permission: any;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    permission: any;
    mobile?: string | null;
    employee: {
      jobPosition?: {
        jobPositionGroup?: {
          id: number;
          name: string;
        };
      };
      departmentEmployeeRole?: {
        rode: boolean;
      }[];
      super: string;
    };
  }
}
