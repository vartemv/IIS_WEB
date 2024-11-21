import { NextResponse } from 'next/server';
import prisma from 'db';
import { PasswordProcessor } from '@/app/utils/crypt';
import { AuthUser } from '@/utils/types/auth'; 
import { DateProcessor } from '@/app/utils/date';
import { TokenService } from '@/app/utils/token';

export async function POST(req: Request) {
    try {
      const body = await req.json();
      const { firstName, lastName, profile_name, email, password } = body;
  
      if  ( !profile_name || !email || !password) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
      }
  
      const first_name = firstName;
      const last_name = lastName;
      const hash_password = await PasswordProcessor.hashPassword(password);
      const sign_up_date = DateProcessor.getCurrentDateString();

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
      
      const token = await TokenService.create({user: profile_name, email: email, role: "User"});

      const return_data : AuthUser = {
        role: "user",
        user: {
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
        secure: true,
        maxAge: 60*60,
        path: '/'
      })

      return response;
    } catch (error) {
      console.log(` ${error} Error in POST handler:`);
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
  }
  