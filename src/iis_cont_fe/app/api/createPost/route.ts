import { NextRequest, NextResponse } from "next/server";
import prisma from 'db';
import { TokenService } from "@/app/utils/token";

export async function POST(req: NextRequest) {
    const token = req.cookies.get("user_token");
    if (!token) {
        return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 });
    }

    const user = await TokenService.verify(token.value);
    if (!user) {
        return NextResponse.json({ success: false, message: "Invalid token" }, { status: 403 });
    }

    try {
        const body = await req.json();
        const { mediafile, description, location, availability, tags } = body;

        const newPost = await prisma.posts.create({
            data: {
                user_id: user.id,
                datetime: new Date(),
                mediafile,
                description,
                location,
                availability: availability === 'TRUE', // Convert to boolean
            },
        });

        // Handle tags
        if (tags && tags.length > 0) {
            for (const tag of tags) {
                let tagRecord = await prisma.tags.findFirst({
                    where: { name: tag },
                });

                if (!tagRecord) {
                    tagRecord = await prisma.tags.create({
                        data: { name: tag },
                    });
                }

                await prisma.post_tags.create({
                    data: {
                        post_id: newPost.id,
                        tag_id: tagRecord.id,
                    },
                });
            }
        }

        return NextResponse.json({ success: true, data: newPost, message: "Post created successfully" });
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json({ success: false, message: "Failed to create post" }, { status: 500 });
    }
}