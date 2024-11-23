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

    try {
        const groups = await prisma.groups.findMany({
            where: {
                owner: sender.id,
            },
            select: {
                group_name: true, // Select the group names
                user_groups: {
                    where: {
                        status: "Pending",
                    },
                    select: {
                        users: {
                            select: {
                                id: true,
                                profile_name: true,
                                photo: true,
                            },
                        },
                    },
                },
            },
        });

        const result = groups.map(group => ({
            group_name: group.group_name,
            pending_users: group.user_groups.map(userGroup => userGroup.users),
        }));

        return NextResponse.json({success: true, data: result, message: "Users retrieved"});
    }
    catch (e) {
        console.log(e);
        return new NextResponse();
    }
};