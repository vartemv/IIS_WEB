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
    user = searchParams.get("group_name") ?? "";
  }

  try {

    const user_data = await prisma.users.findUnique({
      where: {
        profile_name: user,
      }
    });

    if (!user_data) {
      const response = NextResponse.json({ message: "User doesn't exist" }, { status: 400 });
      response.headers.set("Cache-Control", "no-store");
      return response;
    }

    let posts;
    if (sender.user === user) {
      posts = await prisma.posts.findMany({
        where: {
          user_id: user_data?.id,
        },
      });
    } else {
      posts = await prisma.posts.findMany({
        where: {
          user_id: user_data?.id,
          availability: true,
        },
      });
    }


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