import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { unlink } from "fs/promises";
import { prisma } from "@/util/prisma";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const id = formData.get("testCaseId")?.toString();
    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
      );
    }
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadDir = path.join(process.cwd(), "public", "upload", "images");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, path.basename(file.name));
    await writeFile(filePath, buffer);
    // const filePath = path.join(uploadDir, path.basename(file.name));
    // await mkdir(path.dirname(filePath), { recursive: true });
    // await writeFile(filePath, buffer);

    await prisma.testCaseImage.create({
      data: {
        type: "WEB",
        testCaseId: Number(id),
        path: path.basename(file.name)
      }
    })

    return NextResponse.json({ success: true, filename: file.name });
  } catch (error: any) {
    console.error(error)
    return NextResponse.json(
      { success: false},
      { status: 500 }
    );
  }
}
