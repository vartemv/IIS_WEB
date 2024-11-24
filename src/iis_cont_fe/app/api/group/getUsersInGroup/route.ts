import { NextRequest, NextResponse } from "next/server";
import { TokenService } from "@/app/utils/token";
import prisma from 'db';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    let group = "";
    if (searchParams) {
        group = searchParams.get("group") ?? "";
    }

    try {

        const user_data = await prisma.user_groups.findMany({
            where: {
                group_name: group,
                status: "Active"
            }, include: {
                users: {
                    select: {
                        profile_name: true,
                        id: true,
                        photo: true,
                    }
                }
            }
        });

        const groupOwnerDetails = await prisma.groups.findUnique({
            where: {
                group_name: group,
            },
            select: {
                owner: true, // Fetches the ID of the owner
                users: {     // Related data from the `users` table
                    select: {
                        id: true,
                        photo: true,
                        profile_name: true,
                    },
                },
            },
        });

        let usersArray = user_data.map((entry) => ({
            id: entry.users.id,
            profile_name: entry.users.profile_name,
            photo: entry.users.photo,
        }));

        if (groupOwnerDetails)
            usersArray = [groupOwnerDetails?.users, ...usersArray];
        
        if (!user_data) {
            const response = NextResponse.json({ message: "Users doesn't exist" }, { status: 400 });
            response.headers.set("Cache-Control", "no-store");
            return response;
        }


        const response = NextResponse.json({
            success: true,
            data: usersArray,
            message: "Posts retrieved successfully",
        });
        return response;
    }
    catch (e) {
        console.log(e);
        return new NextResponse();
    }
};