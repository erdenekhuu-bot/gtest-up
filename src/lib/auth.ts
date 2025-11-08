import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/util/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 },
  pages: {
    signIn: "/login",
  },
  jwt: {
    secret: process.env.SECRET,
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      id: "localauth",
      name: "localauth",
      credentials: {
        username: { label: "username" },
        password: { label: "password" },
      },
      async authorize(credentials) {
        // const response: any = await DecryptAndChecking({
        //   username: credentials?.username,
        //   password: credentials?.password,
        // });
        // if (response.status !== 200) {
        //   return null;
        // }
        const user = await prisma.authUser.findFirst({
          where: { username: credentials?.username },
          include: {
            employee: {
              select: {
                id: true,
                super: true,
                gender: true,
                permission: true,
                jobPosition: {
                  select: {
                    jobPositionGroup: {
                      select: { jobAuthRank: true },
                    },
                  },
                },
              },
            },
          },
        });
        if (!user || !user.employee) return null;
        const jobAuthRank = Number(
          user.employee.jobPosition?.jobPositionGroup?.jobAuthRank ?? 0
        );
        const permissionKinds =
          jobAuthRank > 1 ? (jobAuthRank <= 2 ? ["VIEW"] : ["READ"]) : ["EDIT"];

        const existingPermission = await prisma.permission.findFirst({
          where: {
            employee: {
              some: { id: user.employee.id },
            },
          },
        });

        if (existingPermission) {
          await prisma.permission.update({
            where: { id: existingPermission.id },
            data: { kind: permissionKinds },
          });
        } else {
          await prisma.permission.create({
            data: {
              kind: permissionKinds,
              employee: {
                connect: { id: user.employee.id },
              },
            },
          });
        }
        const updatedUser = await prisma.authUser.findFirst({
          where: { id: user.id },
          include: {
            employee: {
              select: {
                id: true,
                super: true,
                gender: true,
                permission: true,
                department: true,
                jobPosition: {
                  select: {
                    jobPositionGroup: {
                      select: { jobAuthRank: true },
                    },
                  },
                },
              },
            },
          },
        });
        if (!updatedUser) {
          return null;
        }
        return {
          id: updatedUser.id.toString(),
          name: updatedUser.username,
          employee: updatedUser.employee,
          email: updatedUser.email,
          mobile: updatedUser.mobile,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.employee = user.employee;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.mobile = user.mobile;
      }

      token.exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        username: token.username as string,
        employee: token.employee as any,
        name: token.name ?? null,
        email: token.email ?? null,
        mobile: token.mobile ?? null,
      };

      return session;
    },
  },
};
