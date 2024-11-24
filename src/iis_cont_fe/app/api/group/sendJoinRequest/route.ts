import { NextRequest, NextResponse } from "next/server";
import { TokenService } from "@/app/utils/token";
import prisma from 'db';
import { DateProcessor } from "@/app/utils/date";

export async function POST(req: NextRequest) {
    const token = req.cookies.get("user_token");
    const { group_name} = await req.json();

    if (!group_name) {
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

            await prisma.user_groups.create({
                data:{
                    id_of_user:sender.id,
                    group_name: group_name,
                    status: "Pending",
                    datum: DateProcessor.getCurrentDateString()
                }
            })

            await prisma.groups.update({
                where: {
                    group_name: group_name, // The group_name for the group you want to update
                },
                data: {
                    pocet: {
                        increment: 1, // Increment the value of pocet by 1
                    },
                },
            });
            return NextResponse.json({ success: true, data: null, message: "Request sent" }, { status: 200 });
        }
    catch (e) {
        console.log(e);
        return new NextResponse();
    }
};