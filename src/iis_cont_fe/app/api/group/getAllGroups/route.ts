import { NextRequest, NextResponse } from "next/server";
import prisma from 'db';

export async function GET(req: NextRequest) {
  try {

    const groups = await prisma.groups.findMany({
      include: {
        users: {
          select: {
            profile_name: true,
          },
        },
      },
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