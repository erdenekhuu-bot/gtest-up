import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/util/prisma";
import axios from "axios";
import { OTP } from "@prisma/client";

export async function PUT(req: NextRequest) {
  try {
    const { authuserId } = await req.json();
    const authuser = await prisma.authUser.findUnique({
      where: {
        id: authuserId,
      },
      select: {
        mobile: true,
      },
    });

    const generate = Math.floor(100000 + Math.random() * 900000);

    const sendSms = `http://sms-special.gmobile.mn/cgi-bin/sendsms?username=${
      process.env.OTP_USERNAME
    }&password=${process.env.OTP_PASSWORD}&from=245&to=${
      authuser?.mobile
    }&text=${`Таны баталгаажуулах нэг удаагийн код: ` + generate}`;

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
    await prisma.authUser.update({
      where: {
        id: authuserId,
      },
      data: {
        otp: generate,
        checkotp: OTP.PENDING,
      },
    });
    return NextResponse.json(
      {
        success: true,
        data: generate,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        success: false,
        data: error,
      },
      { status: 500 }
    );
  }
}
