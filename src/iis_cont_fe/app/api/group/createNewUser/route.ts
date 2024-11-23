import { NextRequest, NextResponse } from "next/server";
import { TokenService } from "@/app/utils/token";
import prisma from 'db';
import { DateProcessor } from "@/app/utils/date";

export async function POST(req: NextRequest) {
    const token = req.cookies.get("user_token");
    const { group_name, user_id, status } = await req.json();

    if (!group_name || !user_id || !status) {
        return NextResponse.json({ error: 'data required' }, { status: 400 });
    }

    if (!token) {
        return NextResponse.json({ success: false, data: null, message: "No token provided" }, { status: 301 });
    }

    const sender = await TokenService.verify(token.value)

    if (!sender) {
        return NextResponse.json({ success: false, data: null, message: "Invalid token" }, { status: 403 });
    }

    try {

        const userIsOwner = await prisma.groups.findFirst({
            where: {
                group_name: group_name,
                owner: sender.id,
            },
        });

        if(! !!userIsOwner && (status == "Active" || status == "Banned")){
            return NextResponse.json({ success: false, data: null, message: "You are not the owner" }, { status: 403 });
        }

        const id_of_user = user_id;
        const datum = DateProcessor.getCurrentDateString();

        await prisma.user_groups.create({
            data:{
                group_name,
                id_of_user,
                status,
                datum
            }
          });

        const response = NextResponse.json({
            success: true,
            message: "User added to table",
        });
        return response;
    }
    catch (e) {
        console.log(e);
        return new NextResponse();
    }
};