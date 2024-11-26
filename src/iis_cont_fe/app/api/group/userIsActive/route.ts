import { NextRequest, NextResponse } from "next/server";
import { TokenService } from "@/app/utils/token";
import prisma from "db";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const group = searchParams.get("group") ?? "";

    // Extract the token from the Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json(
            { success: false, data: null, message: "No token provided" },
            { status: 401 }
        );
    }

    const token = authHeader.split(" ")[1]; // Extract the token value

    // Validate the token
    const sender = await TokenService.verify(token);
    if (!sender) {
        return NextResponse.json(
            { success: false, data: null, message: "Invalid token" },
            { status: 403 }
        );
    }

    try {
        // Check if the user is in the group and active
        const userInGroup = await prisma.user_groups.findUnique({
            where: {
                id_of_user_group_name: {
                    id_of_user: sender.id,
                    group_name: group,
                },
            },
            select: {
                status: true, // Only retrieve the status field
            },
        });

        const userIsOwner = await prisma.groups.findUnique({
            where:{
                owner: sender.id,
                group_name: group
            }
        })

        const isUserInGroupAndActive = userInGroup?.status === "Active";

        return NextResponse.json({
            success: true,
            data: isUserInGroupAndActive || !!userIsOwner,
            message: "Check completed successfully",
        });
    } catch (error) {
        console.error("Error fetching user group data:", error);
        return NextResponse.json(
            { success: false, data: null, message: "Internal server error" },
            { status: 500 }
        );
    }
}