import { NextRequest, NextResponse } from 'next/server';
import prisma from 'db';
import { DateProcessor } from '@/app/utils/date';
import { TokenService } from '@/app/utils/token';

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("user_token");
        const body = await req.json();
        const { content, post_id } = body;

        if (!content || !post_id) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }
        
        if (!token) {
            return NextResponse.json({ success: false, data: null, message: "No token provided" }, { status: 301 });
        }
    
        const sender = await TokenService.verify(token.value)
    
        if (!sender) {
            return NextResponse.json({ success: false, data: null, message: "Invalid token" }, { status: 403 });
        }

        const datetime = DateProcessor.getCurrentDateString();
        const author = sender.user;

        await prisma.comments.create({
            data: {
                post_id,
                content,
                datetime,
                author
            },
        });
        
        return NextResponse.json({success: true, message: "Comment created"});
    } catch (error) {
        console.log(` ${error} Error in POST handler:`);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}
