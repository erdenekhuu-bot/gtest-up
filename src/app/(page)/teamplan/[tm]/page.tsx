"use server";
import ViewPlan from "../viewplan/page";

export default async function Page({
  params,
}: {
  params: Promise<{ tm: string }>;
}) {
  const { tm } = await params;

  return <ViewPlan id={tm} />;
}
