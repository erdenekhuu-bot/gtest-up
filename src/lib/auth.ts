import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/util/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { CheckErp } from "@/util/checkout";
import { DecryptAndChecking } from "@/util/checkout";

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
                jobPosition: {
                  select: {
                    jobPositionGroup: true,
                  },
                },
                departmentEmployeeRole: { where: { rode: false } },
              },
            },
          },
        });
        const permission =
          user &&
          (await CheckErp(
            user?.employee?.jobPosition?.jobPositionGroup?.name as string,
            user
          ));
        if (!user) {
          return null;
        }
        return {
          id: user.id.toString(),
          name: user.username,
          employee: user.employee,
          email: user.email,
          mobile: user.mobile,
          permission: permission,
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
        token.permission = user.permission;
      }

      token.exp = Math.floor(Date.now() / 1000) + 60 * 60;
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        username: token.username as string,
        employee: token.employee,
        name: token.name ?? null,
        email: token.email ?? null,
        mobile: token.mobile ?? null,
        permission: token.permission,
      };

      return session;
    },
  },
};
