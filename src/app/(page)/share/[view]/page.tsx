"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/util/prisma";
import { EditPage } from "@/components/window/document/editpage/Editing";

export default async function Page({
  params,
}: {
  params: Promise<{ view: string }>;
}) {
  const { view } = await params;

  return <div>1</div>;
}
