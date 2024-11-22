import { NextRequest, NextResponse } from "next/server";
import { TokenService } from "@/app/utils/token";
import prisma from 'db';

export async function GET(req: NextRequest) {
  const token = req.cookies.get("user_token");

  if (!token) {
    return NextResponse.json({ success: false, data: null, message: "No token provided" }, { status: 301 });
  }

  const sender = await TokenService.verify(token.value)

  if (!sender) {
    return NextResponse.json({ success: false, data: null, message: "Invalid token" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  let user = "";
  if (searchParams) {
    user = searchParams.get("user") ?? "";
  }

  try {

    let posts;
    posts = await prisma.posts.findMany({
        where: {
            availability: true,
        },
    });


    const response = NextResponse.json({
      success: true,
      data: posts,
      message: "Posts retrieved successfully",
    });
    return response;
  }
  catch (e) {
    console.log(e);
    return new NextResponse();
  }
};