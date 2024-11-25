import { NextRequest, NextResponse } from "next/server";
import prisma from 'db';
import { TokenService } from "@/app/utils/token";

export async function GET(req: NextRequest) {
  try {
    let posts;
    
    const token = req.cookies.get("user_token");

    if (!token) {
      return NextResponse.json({ success: false, data: null, message: "No token provided" }, { status: 301 });
    }

    const sender = await TokenService.verify(token.value);

    if (!sender) {
      return NextResponse.json({ success: false, data: null, message: "Invalid token" }, { status: 403 });
    }

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

    const filteredPosts = await Promise.all(posts.map(async (post) => {
      if (post.availability) {
        const userReaction = await prisma.user_reactions.findFirst({
          where: {
              id_of_user: sender.id,
              post_id: post.id,
          },
        });
        
        const postWithUserReaction = {
          ...post,
          user_reaction: userReaction ? { reacted: true } : { reacted: false },
        };

        return postWithUserReaction;
      } else {
        
        const allowedUser = await prisma.user_posts.findFirst({
          where: {
            post_id: post.id,
            id_of_user: sender.id,
          },
        });
        return allowedUser ? post : null;
      }
    }));

    const response = NextResponse.json({
      success: true,
      data: filteredPosts.filter(post => post !== null),
      message: "Posts retrieved successfully",
    });
    return response;
  }
  catch (e) {
    console.log(e);
    return new NextResponse();
  }
};