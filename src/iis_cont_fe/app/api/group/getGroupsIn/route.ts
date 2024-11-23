import { NextRequest, NextResponse } from "next/server";
import prisma from 'db';
import { TokenService } from "@/app/utils/token";

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

    const groups = await prisma.user_groups.findMany({
      where: {
        id_of_user: sender.id,
      },
      include: {
        groups: {
          include: {
            users: { // Include the user details of the owner
              select: {
                profile_name: true, // Select the profile_name of the owner
              },
            },
          },
        },
      },
    });

      const result = groups.map(userGroup => ({
        group_name: userGroup.groups.group_name,
        users: userGroup.groups.users.profile_name,
        photo: userGroup.groups.photo,
        pocet: userGroup.groups.pocet,
        datum: userGroup.groups.datum,
        status: userGroup.status,
      }));

    const response = NextResponse.json({
      success: true,
      data: result,
      message: "Groups retrieved successfully",
    });
    return response;
  }
  catch (e) {
    console.log(e);
    return new NextResponse();
  }
};