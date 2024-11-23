import { NextResponse, NextRequest } from 'next/server';
import prisma from 'db';
import { PasswordProcessor } from '@/app/utils/crypt';
import { AuthUser } from '@/utils/types/auth';
import { DateProcessor } from '@/app/utils/date';
import { TokenService } from '@/app/utils/token';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { group_name } = body;
    const token = req.cookies.get("user_token");


    if (!group_name) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (!token) {
        return NextResponse.json({ success: false, data: null, message: "No token provided" }, { status: 301 });
    }

    const sender = await TokenService.verify(token.value)

    if (!sender) {
        return NextResponse.json({ success: false, data: null, message: "Invalid token" }, { status: 403 });
    }

    const owner = sender.id;
    const datum = DateProcessor.getCurrentDateString();

    try {

        await prisma.groups.create({
            data: {
                group_name,
                datum,
                owner
            },
        });

        const response = NextResponse.json({
            success: true,
            message: "Group created successfully",
        });

        return response;
    } catch (error) {
        console.log(` ${error} Error in POST handler:`);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}
