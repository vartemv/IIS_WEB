import { NextRequest, NextResponse } from "next/server";
import { TokenService } from "@/app/utils/token";
import prisma from 'db';

export async function POST(req: NextRequest) {
    const token = req.cookies.get("user_token");
    const { role, user_id } = await req.json();

    if (!role || !user_id) {
        return NextResponse.json({ error: 'data required' }, { status: 400 });
    }

    if (!token) {
        return NextResponse.json({ success: false, data: null, message: "No token provided" }, { status: 301 });
    }

    const sender = await TokenService.verify(token.value)

    if (!sender || sender.role != "Admin") {
        return NextResponse.json({ success: false, data: null, message: "Invalid token" }, { status: 403 });
    }

    try {

            await prisma.users.update({
                where: {
                    id: user_id, // The group_name for the group you want to update
                },
                data: {
                    role: role
                },
            });

        
        const response = NextResponse.json({
            success: true,
            message: "Role changed successfully",
        });
        return response;
    }
    catch (e) {
        console.log(e);
        return new NextResponse();
    }
};