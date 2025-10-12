import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/util/prisma";
import ejs from "ejs";
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";

export const config = {
  runtime: "nodejs",
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const document = await prisma.document.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            employee: {
              select: {
                firstname: true,
                lastname: true,
                jobPosition: true,
                department: true,
              },
            },
          },
        },
        detail: true,
        attribute: true,
        budget: true,
        riskassessment: true,
        testcase: {
          include: {
            testCaseImage: true,
          },
        },
        documentemployee: {
          select: {
            employee: {
              select: {
                firstname: true,
                lastname: true,
                jobPosition: true,
                department: true,
              },
            },
            role: true,
            startedDate: true,
            endDate: true,
          },
        },
        report: {
          include: {
            issue: true,
            team: true,
            testcase: true,
            usedphone: true,
          },
        },
      },
    });
    const templatePath = path.join(
      process.cwd(),
      "public",
      "templates",
      "document.ejs"
    );
    const templateContent = fs.readFileSync(templatePath, "utf-8");
    const htmlContent = ejs.render(templateContent, { document });
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: {
        top: "10mm",
        bottom: "10mm",
      },
      printBackground: true,
    });
    const buffer = Buffer.from(pdfBuffer);

    await browser.close();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=paper_${id}.pdf`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
