import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/util/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search') || '';
        const page = Number(searchParams.get('page') || '1');
        const pageSize = Number(searchParams.get('pageSize') || '10');
        const record = await prisma.jobPosition.findMany({
            where: {
                name: {
                    contains: search
                }
            },
            distinct: ['name'],
            skip: (page - 1) * pageSize,
            take: pageSize,
        })

        return NextResponse.json({ 
            success: true, 
            data: record
        }, { status: 200 });
       
    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            error: error
        }, { status: 500 });
    }
}