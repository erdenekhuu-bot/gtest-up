import { prisma } from "@/util/prisma";
import { CheckPaper } from "@/components/window/confirm/checkpaper";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ list: string }>;
}) {
  const { list } = await params;
  const record = await prisma.$transaction(async (tx) => {
    const user = await tx.authUser.findUnique({
      where: {
        id: Number(list),
      },
      select: {
        employee: true,
      },
    });
    const data =
      user &&
      (await tx.confirmPaper.findMany({
        where: {
          employeeId: user.employee?.id,
        },
        include: {
          document: true,
        },
      }));
    return data;
  });

  return <CheckPaper data={record} />;
}
