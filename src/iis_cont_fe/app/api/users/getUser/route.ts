import { NextRequest, NextResponse } from "next/server";
import prisma from 'db';
import { TokenService } from "@/app/utils/token";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("user_token");

    if (!token) {
      return NextResponse.json({ success: false, data: null, message: "No token provided" }, { status: 301 });
    }

    const sender = await TokenService.verify(token.value);

    if (!sender) {
      return NextResponse.json({ success: false, data: null, message: "Invalid token" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    let user_profile = "";
    if (searchParams) {
      user_profile = searchParams.get("user") ?? "";
    }

    const user = await prisma.users.findUnique({
        where: { profile_name : user_profile },
      });

    if (!user) {
        return NextResponse.json({ success: false, data: null, message: "User not found" }, { status: 404 });
    }

    const response = NextResponse.json({
      success: true,
      data: user,
      message: "Users retrieved successfully",
    });
    return response;
  }
  catch (e) {
    console.log(e);
    return new NextResponse();
  }
};