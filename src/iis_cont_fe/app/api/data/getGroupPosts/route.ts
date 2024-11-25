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
    let group = "";
    if (searchParams) {
        group = searchParams.get("group") ?? "";
    }

    try {
        // First check if user is in the group
        const userInGroup = await prisma.user_groups.findFirst({
            where: {
                group_name: group,
                id_of_user: sender.id,
                status: 'Active'
            },
        });

        if (!userInGroup) {
            return NextResponse.json({
                success: false,
                data: [],
                message: "User not in group",
            });
        }

        const groupPosts = await prisma.group_posts.findMany({
            where: {
                group_name: group,
            },
            include: {
                posts: {
                    include: {
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
                        post_tags: {
                            include: {
                                tags: true,
                            },
                        },
                        reactions: true,
                    },
                },
            },
        });

        // Add user reaction data for each post
        const postsWithReactions = await Promise.all(
            groupPosts.map(async (groupPost) => {
                const userReaction = await prisma.user_reactions.findFirst({
                    where: {
                        id_of_user: sender.id,
                        post_id: groupPost.posts.id,
                    },
                });

                return {
                    ...groupPost.posts,
                    user_reaction: userReaction ? { reacted: true } : { reacted: false },
                };
            })
        );

        const response = NextResponse.json({
            success: true,
            data: postsWithReactions,
            message: "Posts retrieved successfully",
        });
        return response;
    }
    catch (e) {
        console.log(e);
        return NextResponse.json({ 
            success: false, 
            data: null, 
            message: "Error retrieving group posts" 
        }, { status: 500 });
    }
}