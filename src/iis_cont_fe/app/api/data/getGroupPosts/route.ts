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
        const groupPosts = await prisma.group_posts.findMany({
            where: {
                group_name: group,
            },
            include: {
                posts: {
                    include: {
                        comments: true,
                        users: {
                            select: {
                                profile_name: true,
                            }
                        }
                    },
                },
            },
        });

        const userInGroup = await prisma.user_groups.findFirst({
            where: {
                group_name: group,
                id_of_user: sender.id,
            },
        });

        const response = NextResponse.json({
            success: true,
            data: groupPosts.map((groupPost) => groupPost.posts),
            message: "Posts retrieved successfully",
        });
        return response;
    }
    catch (e) {
        console.log(e);
        return new NextResponse();
    }
};