"use server";
import { ShareComp } from "@/components/window/share/sharecomp";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/util/prisma";

export default async function Page(props: {
  searchParams?: Promise<{
    search?: string;
    page?: string;
    pageSize?: string;
  }>;
}) {
  const session = await getServerSession(authOptions);
  const searchParams = await props.searchParams;
  const search = searchParams?.search || "";
  const page = Number(searchParams?.page) || 1;
  const pageSize = Number(searchParams?.pageSize) || 10;

  const record = await prisma.$transaction(async (tx) => {
    const authUser = await tx.authUser.findUnique({
      where: {
        id: Number(session?.user.id),
      },
      include: {
        employee: true,
      },
    });
    const document =
      authUser &&
      (await tx.shareGroup.findMany({
        where: {
          AND: [
            {
              document: {
                state: "SHARED",
              },
            },
            {
              employeeId: authUser.employee?.id,
            },
          ],
        },
        distinct: ["documentId"],
        include: {
          employee: true,
          document: true,
        },
      }));
    return document;
  });

  return <ShareComp document={record} />;
}
