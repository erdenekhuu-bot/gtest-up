"use server";

import ViewPaper from "../viewpaper/page";

export default async function Page({
  params,
}: {
  params: Promise<{ tm: string }>;
}) {
  const { tm } = await params;

  return <ViewPaper id={tm} />;
}
