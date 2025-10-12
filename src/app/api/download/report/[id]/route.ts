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
            where: { id: parseInt(id) },
            include: {
                testcase: { include: { testCaseImage: true } },
                user: { select: { employee: { select: { firstname: true, lastname: true, jobPosition: true, department: true } } } },
                detail: true,
                attribute: true,
                budget: true,
                riskassessment: true,
                documentemployee: {
                    select: {
                        employee: { select: { firstname: true, lastname: true, jobPosition: true, department: true } },
                        role: true,
                        startedDate: true,
                        endDate: true,
                    },
                },
                report: { include: { issue: true, team: true, usedphone: true } },
            },
        });

        if (!document) {
            return NextResponse.json({ success: false, message: "Document not found" }, { status: 404 });
        }


        const templatePath = path.join(process.cwd(), "public", "templates", "newreport.ejs");
        const templateContent = fs.readFileSync(templatePath, "utf-8");

        const htmlContent = ejs.render(templateContent, { document });

        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
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
              `
            });

        const pdfBuffer = await page.pdf({
            format: "A4",
            margin: { top: "5mm", bottom: "5mm" },
            printBackground: true,
        });
        await browser.close();
        return new NextResponse(new Uint8Array(pdfBuffer), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename=report_${id}.pdf`,
                "Content-Length": pdfBuffer.length.toString(),
            },
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, data: error }, { status: 500 });
    }
}
