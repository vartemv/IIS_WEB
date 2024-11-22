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
        const { mediafile, description, location, availability } = body;

        const newPost = await prisma.posts.create({
            data: {
                user_id: user.id,
                datetime: new Date(),
                mediafile,
                description,
                location,
                availability: availability === 'true',
            },
        });

        return NextResponse.json({ success: true, data: newPost, message: "Post created successfully" });
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json({ success: false, message: "Failed to create post" }, { status: 500 });
    }
}
