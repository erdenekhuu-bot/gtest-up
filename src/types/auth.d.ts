import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      employee?: {
        jobPosition?: {
          jobPositionGroup?: {
            id: number;
            name: string;
          };
        };
        departmentEmployeeRole?: {
          rode: boolean;
        }[];
      };
      name?: string | null;
      email?: string | null;
      image?: string | null;
      permission: any;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    permission: any;
    employee?: {
      jobPosition?: {
        jobPositionGroup?: {
          id: number;
          name: string;
        };
      };
      departmentEmployeeRole?: {
        rode: boolean;
      }[];
    };
  }
}
