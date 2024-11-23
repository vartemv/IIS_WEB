import { NextRequest, NextResponse } from "next/server";
import prisma from 'db';

export async function GET(req: NextRequest) {
    try {

        const { searchParams } = new URL(req.url);
        let group = "";
        if (searchParams) {
            group = searchParams.get("group") ?? "";
        }

        const groups = await prisma.groups.findFirst({
            where:{
                group_name: group
            }
        });

        const response = NextResponse.json({
            success: true,
            data: groups,
            message: "Groups retrieved successfully",
        });
        return response;
    }
    catch (e) {
        console.log(e);
        return new NextResponse();
    }
};