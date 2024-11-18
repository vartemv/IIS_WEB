import { NextResponse } from 'next/server';
import prisma from 'db';

const getCurrentDateString = () => {
	const date = new Date();
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
	const day = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}T00:00:00.000Z`;
};

export async function POST(req: Request) {
  console.log("into post")
    try {
      const body = await req.json();
      const { firstName, lastName, profile_name, email, password } = body;
  
      if  ( !profile_name || !email || !password) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
      }

      console.log(body)
  
      const first_name = firstName;
      const last_name = lastName;
      const hash_password = password;
      const sign_up_date = getCurrentDateString();

      const newUser = await prisma.users.create({
        data: {
          first_name,
          last_name,
          profile_name,
          sign_up_date,
          hash_password, // Ideally, hash the password before storing
        },
      });
  
      return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
      console.log(` ${error} Error in POST handler:`);
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
  }
  