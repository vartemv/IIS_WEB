import { NextRequest, NextResponse } from "next/server";
import { TokenService } from "@/app/utils/token";
import prisma from 'db';

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

        if (! !!userIsOwner && (status === "Active" || status === "Refuse")) {
            return NextResponse.json({ success: false, data: null, message: "You are not the owner" }, { status: 403 });
        }

        if (status === "Refuse") {

            await prisma.user_groups.delete({
                where: {
                    id_of_user_group_name: {
                        id_of_user: user_id,
                        group_name: group_name
                    }
                },
            });

            await prisma.groups.update({
                where: {
                    group_name: group_name, // The group_name for the group you want to update
                },
                data: {
                    pocet: {
                        decrement: 1, // Increment the value of pocet by 1
                    },
                },
            });

        } else {

            await prisma.user_groups.update({
                where: {
                    id_of_user_group_name: {
                        id_of_user: user_id,
                        group_name: group_name,
                    },
                },
                data: {
                    status: status,
                },
            });

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
        }

        const response = NextResponse.json({
            success: true,
            message: "Status changed successfully",
        });
        return response;
    }
    catch (e) {
        console.log(e);
        return new NextResponse();
    }
};