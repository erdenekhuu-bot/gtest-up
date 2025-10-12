import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { unlink } from "fs/promises";
import { prisma } from "@/util/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    if (!filename) {
      return NextResponse.json(
        { success: false, message: "No filename provided" },
        { status: 400 }
      );
    }

    const file_path = await prisma.testCaseImage.findUnique({
      where: {
        id: Number(filename)
      }
    })

    const filePath = path.join(
      process.cwd(),
      "public",
      "upload",
      "images",
      String(file_path?.path)
    );
    await unlink(filePath);

    await prisma.testCaseImage.delete({
      where: {
        id: Number(filename)
      }
    })

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: String(error) },
      { status: 500 }
    );
  }
}
