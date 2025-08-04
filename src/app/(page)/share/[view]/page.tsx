"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/util/prisma";
import { EditPage } from "@/components/window/document/editpage/Editing";
import { ShareMember } from "@/components/window/share/sharemember";

export default async function Page({
  params,
}: {
  params: Promise<{ view: string }>;
}) {
  const { view } = await params;

  return <ShareMember />;
}
