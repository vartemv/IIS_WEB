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
  const postId = searchParams.get("id");

  if (!postId) {
    return NextResponse.json({ success: false, message: "Post ID is required" }, { status: 400 });
  }
  

  try {
    // First query to get the post's user_id
    const initialPost = await prisma.posts.findUnique({
      where: {
        id: parseInt(postId),
      },
      select: {
        user_id: true
      }
    });
  
    if (!initialPost) {
      return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
    }
  
    // Second query to get all post data with filtered users
    const post = await prisma.posts.findUnique({
      where: {
        id: parseInt(postId),
      },
      include: {
        post_tags: {
          include: {
            tags: true,
          },
        },
        user_posts: { 
          where: {
            users: {
              AND: [
                {
                  role: {
                    notIn: ['Mod', 'Admin']
                  }
                },
                {
                  id: {
                    not: initialPost.user_id
                  }
                }
              ]
            }
          },
          include: {
            users: {
              select: {
                profile_name: true
              }
            }
          }
        },
        group_posts: true,
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
  
    if (!post) {
      return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
    }

    if (!post.availability) {
      const hasAccess = await prisma.user_posts.findFirst({
        where: {
          post_id: parseInt(postId),
          id_of_user: sender.id,
        },
      });

      if (!hasAccess) {
        return NextResponse.json({ success: false, message: "You don't have permission to view this post" }, { status: 403 });
      }
    }

     // Check if current user is the post creator
     if (post.user_id !== sender.id) {
      return NextResponse.json({ 
        success: false, 
        message: "You don't have permission to edit this post" 
      }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: post,
      message: "Post retrieved successfully",
    });

  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch post" }, { status: 500 });
  }
}