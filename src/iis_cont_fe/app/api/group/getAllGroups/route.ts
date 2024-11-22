import { NextRequest, NextResponse } from "next/server";
import prisma from 'db';

export async function GET(req: NextRequest) {
  try {
    console.log("Hello");
    let groups;
    groups = await prisma.groups.findMany();

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