import { NextResponse } from 'next/server';
import prisma from 'db';
import { TokenService } from '@/app/utils/token';
import { PasswordProcessor } from '@/app/utils/crypt';
import { AuthUser } from '@/utils/types/auth';

export async function POST(req: Request) {
    try {
      const body = await req.json();
      const {email , password } = body;
  
      if  (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
      }
      
      const result = await prisma.users.findUnique({
        where: {
          email: email,
        },
      });

      if (!result){
        return NextResponse.json({ error: 'Wrong password or email'}, { status: 401 });
      }

      if(! await PasswordProcessor.verifyPassword(result.hash_password, password)){
        return NextResponse.json({ error: 'Wrong password or email'}, { status: 401 });
      }

      const token = await TokenService.create({user: result.profile_name, email: email, role: "User", id: result.id});

      const return_data : AuthUser = {
        role: "user",
        user: {
          id: result.id,
          email: email,
          profileName: result.profile_name
        }
      }

      const response = NextResponse.json({
        success: true,
        data: return_data,
        message: "User found",
      });

      response.cookies.set("user_token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 60*60,
        sameSite: 'none',
        path: '/'
      })

      return response;
    } catch (error) {
      console.log(` ${error} Error in POST handler:`);
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
  }