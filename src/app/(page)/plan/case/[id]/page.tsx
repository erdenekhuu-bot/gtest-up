import { prisma } from "@/util/prisma";
import { AddCase } from "@/components/window/document/addcase/AddCase";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const record = await prisma.document.findUnique({
    where: { id: Number(id) },
    select: {
      testcase: {
        orderBy: {
          id: "asc",
        },
        include: {
          testCaseImage: true,
        },
      },
    },
  });

  return <AddCase data={record} />;
}
