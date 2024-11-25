import { NextResponse, NextRequest } from 'next/server';
import prisma from 'db';
import { DateProcessor } from '@/app/utils/date';
import { TokenService } from '@/app/utils/token';
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { group_name, photo } = body;
    const token = req.cookies.get("user_token");

    if (!group_name || !photo) {
        return NextResponse.json({ success: false, message: "Error", error: 'group_name or photo is missing' }, { status: 400 });
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
                    owner,
                    photo: photo,
                    pocet: 1
                },
            });
        }
        catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
                // Handle unique constraint violation
                return NextResponse.json(
                    { success: false, message: "Group with this name exists" },
                    { status: 200 }
                );
            }
        }

        const response = NextResponse.json({
            success: true,
            message: "Group created successfully",
        });

        return response;
}
