import { NextRequest, NextResponse } from "next/server";
import { TokenService } from "@/app/utils/token";
import prisma from 'db';

export async function GET(req: NextRequest) {
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