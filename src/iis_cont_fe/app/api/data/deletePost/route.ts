import { NextRequest, NextResponse } from 'next/server';
import prisma from 'db';
import { TokenService } from '@/app/utils/token';
import { unlink } from "fs/promises";

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json(); // Parse the request body
        const { post_id, file_name } = body;
        const token = req.cookies.get("user_token");
        if (!token) {
            return NextResponse.json({ success: false, data: null, message: "No token provided" }, { status: 301 });
        }

        const sender = await TokenService.verify(token.value)

        if (!sender || (sender.role !== "Admin" && sender.role !== "Mod")) {
            return NextResponse.json({ success: false, data: null, message: "Invalid token" }, { status: 403 });
        }

        if (!post_id || !file_name) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Post id and a file is required.',
                },
                { status: 400 }
            );
        }

        const result = await prisma.posts.delete({
            where: {
                id: post_id
            }
        },
        );

        if (result) {
            // console.log(file_name);
            await unlink(`public${file_name}`);
            return NextResponse.json(
                {
                    success: true,
                    message: 'Post deleted successfully.',
                },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Post not found.',
                },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error.',
            },
            { status: 500 }
        );
    }
}