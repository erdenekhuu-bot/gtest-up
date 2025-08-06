import { prisma } from "@/util/prisma";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const { employeeId } = await req.json();
    const user = await prisma.employee.findUnique({
      where: {
        id: Number(employeeId),
      },
      select: {
        authUser: {
          select: {
            mobile: true,
          },
        },
      },
    });
    const sendSms = `http://sms-special.gmobile.mn/cgi-bin/sendsms?username=${
      process.env.OTP_USERNAME
    }&password=${process.env.OTP_PASSWORD}&from=245&to=${
      user?.authUser?.mobile
    }&text=${`Тантай хэн нэгэн нь тестийн удирдамж хуваалцлаа. Та программ руу гаа орж шалгаарай`}`;

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
    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, data: error }, { status: 500 });
  }
}
