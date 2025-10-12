import { prisma } from "@/util/prisma";
import {TestCaseAction} from "@/components/window/report/TestCaseAction";

export const dynamic = "force-dynamic";

export default async function Page({params}: {params: Promise<{ id: string }>}){
    const { id } = await params;
    const record = await prisma.testCase.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            document: {
                select: {
                    documentemployee: {
                        select: {
                            employee: true,
                        },
                    },
                },
            }
        }
    })
    return <TestCaseAction record={record}/>
}