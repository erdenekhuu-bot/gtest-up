import { prisma } from "@/util/prisma";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    try {
        const { id } = await req.json();
        const document = await prisma.document.findUnique({
                where: {id},
                select: {
                    departmentEmployeeRole: {
                        include: {
                            employee: {
                                select: {
                                    authUser:true,
                                    firstname: true,
                                    lastname: true,
                                    jobPosition: {
                                        select: {
                                            jobPositionGroup: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })


        const list:any=document?.departmentEmployeeRole.filter((item:any)=>item.employee.jobPosition.jobPositionGroup.jobAuthRank <= 2)
        const dir:any=document?.departmentEmployeeRole.filter((item:any)=>item.employee.jobPosition.jobPositionGroup.jobAuthRank <= 4 && item.employee.jobPosition.jobPositionGroup.jobAuthRank >2)
        const ceo:any=document?.departmentEmployeeRole.filter((item:any)=>item.employee.jobPosition.jobPositionGroup.jobAuthRank <= 6 && item.employee.jobPosition.jobPositionGroup.jobAuthRank >4)
        const result1=list.every((item:any)=>item.rode === true)
        const result2=dir.every((item:any)=>item.rode === true)

        if (result1) {
            await Promise.all(dir.map((i: any) => Demo(i.employee.authUser.mobile)));

            if (result2) {
                await Promise.all(
                    ceo.map((i: any) => Demo(i.employee.authUser.mobile))
                );
            }
        }
        return NextResponse.json({ success: true}, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, data: error }, { status: 500 });
    }
}


export async function PATCH(req: NextRequest) {
    try {
        const { id } = await req.json();
        const document = await prisma.document.findUnique({
            where: {id},
            select: {
                departmentEmployeeRole: {
                    include: {
                        employee: {
                            select: {
                                authUser:true,
                                firstname: true,
                                lastname: true,
                                jobPosition: {
                                    select: {
                                        jobPositionGroup: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        const list:any=document?.departmentEmployeeRole.filter((item:any)=>item.employee.jobPosition.jobPositionGroup.jobAuthRank <= 2)

        await Promise.all(list.map((i: any) => Demo(i.employee.authUser.mobile)));

        return NextResponse.json({ success: true}, { status: 200 });


    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, data: error }, { status: 500 });
    }
}


async function Demo(mobile:string){
    const sendSms = `http://sms-special.gmobile.mn/cgi-bin/sendsms?username=${process.env.OTP_USERNAME}
                                                                  &password=${process.env.OTP_PASSWORD}
                                                                  &from=245&to=${mobile}
                                                                  &text=${`Тань дээр шалгагдах удирдамж ирлээ.`}`;

    const response = await axios.get(sendSms);
    console.log(response.data);

    if (response.data !== "0: Accepted for delivery") {
        console.log("Хүлээн авагчийн дугаар буруу");
        return NextResponse.json(
            {
                success: false,
                data: "Хүлээн авагчийн дугаар буруу",
            },
            {
                status: 404,
            }
        );
    }
}