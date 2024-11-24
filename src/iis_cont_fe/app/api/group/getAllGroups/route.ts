import { NextRequest, NextResponse } from "next/server";
import prisma from 'db';
import { TokenService } from "@/app/utils/token";
import { setMaxIdleHTTPParsers } from "http";

export async function GET(req: NextRequest) {
  try {

    const token = req.cookies.get("user_token");

    if (!token) {
        return NextResponse.json({ success: false, data: null, message: "No token provided" }, { status: 301 });
    }

    const sender = await TokenService.verify(token.value)

    if (!sender) {
        return NextResponse.json({ success: false, data: null, message: "Invalid token" }, { status: 403 });
    }

    const groups = await prisma.groups.findMany({
      include: {
        user_groups: {
          where: {
            id_of_user: sender.id,
          },select: {
            status: true,
          }
        },
      },
    });

    const formattedGroups = groups.map(group => ({
      group_name: group.group_name,
      owner: group.owner,
      pocet: group.pocet,
      datum: group.datum,
      photo: group.photo,
      user_status: group.owner === sender.id
      ? "owner"
      : group.user_groups.length > 0
      ? group.user_groups[0].status
      : null,
    }));

    const response = NextResponse.json({
      success: true,
      data: formattedGroups,
      message: "Groups retrieved successfully",
    });
    return response;
  }
  catch (e) {
    console.log(e);
    return new NextResponse();
  }
};