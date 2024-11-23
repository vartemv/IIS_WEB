import { NextRequest, NextResponse } from "next/server";
import prisma from 'db';

export async function GET(req: NextRequest) {
  try {
    let posts;
    posts = await prisma.posts.findMany({
      include: {
        post_tags: {
          include: {
            tags: true,
          },
        },
        comments: {
          include: {
            users: { // alias for related user details
              select: {
                photo: true,
              },
            },
          },
        },
        users:{
          select:{
            profile_name: true,
            photo: true,
          }
        },
        reactions: true,
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