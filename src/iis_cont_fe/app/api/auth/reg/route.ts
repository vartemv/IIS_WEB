import { NextResponse } from 'next/server';
import prisma from 'db';
import { PasswordProcessor } from '@/app/utils/crypt';
import { AuthUser } from '@/utils/types/auth';
import { DateProcessor } from '@/app/utils/date';
import { TokenService } from '@/app/utils/token';
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, profile_name, email, password } = body;

    if (!profile_name || !email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const first_name = firstName;
    const last_name = lastName;
    const hash_password = await PasswordProcessor.hashPassword(password);
    const sign_up_date = DateProcessor.getCurrentDateString();

    try {
      await prisma.users.create({
        data: {
          first_name,
          last_name,
          profile_name,
          sign_up_date,
          hash_password,
          email,
        },
      });
    }
    catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        // Handle unique constraint violation
        return NextResponse.json(
          { success: false, message: "Profile name or email already exists. Please use a different one." },
          { status: 400 }
        );
      }
    }

    const result = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    let user_id = 0;
    if (result) {
      user_id = result.id;
    }

    const token = await TokenService.create({ user: profile_name, email: email, role: "User", id: user_id });

    const return_data: AuthUser = {
      role: "user",
      user: {
        id: user_id,
        email: email,
        profileName: profile_name
      }
    }

    const response = NextResponse.json({
      success: true,
      data: return_data,
      message: "User created successfully",
    });

    response.cookies.set("user_token", token, {
      httpOnly: true,
      maxAge: 60 * 60,
      path: '/'
    })

    return response;
  } catch (error) {
    console.log(` ${error} Error in POST handler:`);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
