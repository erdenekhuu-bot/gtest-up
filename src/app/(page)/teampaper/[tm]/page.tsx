import ViewPaper from "../viewpaper/page";
import { prisma } from "@/util/prisma";

export default async function Page({
  params,
}: {
  params: Promise<{ tm: string }>;
}) {
  const { tm } = await params;
  const record = await prisma.document.findUnique({
    where: {
      id: Number(tm),
    },
    select: {
      confirm: {
        include: {
          sub: {
            include: {
              employee: true,
            },
          },
        },
      },
    },
  });
  return <ViewPaper document={record} />;
}
