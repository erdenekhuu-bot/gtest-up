import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/util/prisma";
import ejs from "ejs";
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";

export const config = { runtime: "nodejs" };

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const document = await prisma.document.findUnique({
      where: { id: Number(id) },
      include: {
        testcase: { include: { testCaseImage: true } },
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
        report: { include: { issue: true, team: true, usedphone: true } },
        confirm: {
          include: {
            sub: true,
          },
        },
      },
    });
    const accessrole = await prisma.departmentEmployeeRole.findMany({
      where: {
        AND: [
          {
            role: "ACCESSER",
          },
          {
            documentId: Number(id),
          },
        ],
      },
      distinct: ["employeeId"],
      select: {
        employee: {
          include: {
            jobPosition: true,
            department: true,
            authUser: true,
          },
        },
        role: true,
        state: true,
        startedDate: true,
        endDate: true,
      },
      orderBy: {
        startedDate: "asc",
      },
    });
    const middlerole = await prisma.departmentEmployeeRole.findMany({
      where: {
        AND: [
          {
            role: "MIDDLE",
          },
          {
            documentId: Number(id),
          },
        ],
      },
      distinct: ["employeeId"],
      select: {
        employee: {
          include: {
            jobPosition: true,
            department: true,
            authUser: true,
          },
        },
        role: true,
        state: true,
        startedDate: true,
        endDate: true,
      },
      orderBy: {
        startedDate: "asc",
      },
    });
    const viewrole = await prisma.documentEmployee.findMany({
      where: {
        AND: [
          {
            role: "Техникийн нөхцөлөөр хангах",
          },
          {
            documentId: Number(id),
          },
        ],
      },
      distinct: ["employeeId"],
      select: {
        employee: {
          include: {
            jobPosition: true,
            department: true,
            authUser: true,
          },
        },
      },
      orderBy: {
        startedDate: "asc",
      },
    });
    const makerole = await prisma.shareGroup.findMany({
      select: {
        employee: true,
      },
      distinct: ["employeeId"],
    });
    const templatePath = path.join(
      process.cwd(),
      "public",
      "templates",
      "newreport.ejs"
    );
    const templateContent = fs.readFileSync(templatePath, "utf-8");

    const htmlContent = ejs.render(templateContent, {
      document,
      accessrole,
      middlerole,
      viewrole,
      makerole,
    });

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
    await page.addStyleTag({
      content: `
                .ck-content img {
                  display: inline-block !important;
                  vertical-align: middle !important;
                  margin-right: 8px;
                }
                figure.ck-image {
                  display: inline-block !important;
                  margin: 0 5px !important;
                }
              `,
    });

    const pdfBuffer: any = await page.pdf({
      format: "A4",
      margin: { top: "5mm", bottom: "5mm" },
      printBackground: true,
    });

    await browser.close();
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        // 👇 this line makes it view inline (no download)
        "Content-Disposition": `inline; filename=paper_${id}.pdf`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
