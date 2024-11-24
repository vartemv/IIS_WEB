import { NextRequest, NextResponse } from "next/server";
import prisma from 'db';
import { TokenService } from "@/app/utils/token";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("user_token");
  
  if (!token) {
    return NextResponse.json({ success: false, data: null, message: "No token provided" }, { status: 301 });
  }

  const sender = await TokenService.verify(token.value);

  if (!sender) {
    return NextResponse.json({ success: false, data: null, message: "Invalid token" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const tag = searchParams.get("tag");

  // Add null check for tag
  if (!tag) {
    return NextResponse.json({ success: false, data: null, message: "Tag parameter is required" }, { status: 400 });
  }

  try {
    const posts = await prisma.posts.findMany({
      where: {
        post_tags: {
          some: {
            tags: {
              name: tag, 
            },
          },
        },
      },
      include: {
        post_tags: {
          include: {
            tags: true,
          },
        },
        comments: {
          include: {
            users: {
              select: {
                photo: true,
              },
            },
          },
        },
        users: {
          select: {
            profile_name: true,
            photo: true,
          }
        },
        reactions: true,
      },
    });

    // Filter posts based on visibility permissions
    const filteredPosts = await Promise.all(posts.map(async (post) => {
      // If post is public, show it
      if (post.availability) {
        return post;
      }
      
      // For private posts, check if user has access
      const allowedUser = await prisma.user_posts.findFirst({
        where: {
          post_id: post.id,
          id_of_user: sender.id,
        },
      });

      // Also check if post is in any groups the user is part of
      const allowedViaGroup = await prisma.group_posts.findFirst({
        where: {
          post_id: post.id,
          groups: {
            user_groups: {
              some: {
                id_of_user: sender.id,
                status: 'Active'
              }
            }
          }
        }
      });

      // Return post only if user has direct access or group access
      return (allowedUser || allowedViaGroup) ? post : null;
    }));

    const response = NextResponse.json({
      success: true,
      data: filteredPosts.filter(post => post !== null),
      message: "Posts retrieved successfully",
    });
    return response;
  } catch (e) {
    console.log(e);
    return NextResponse.json({ success: false, data: null, message: "Failed to fetch posts by tag" }, { status: 500 });
  }
}
