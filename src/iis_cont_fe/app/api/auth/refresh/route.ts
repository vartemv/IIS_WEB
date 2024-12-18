import { NextResponse, NextRequest } from "next/server";
import { TokenService } from "@/app/utils/token";
import { AuthUser } from '@/utils/types/auth'; 

export async function GET(req: NextRequest) {
  const token = req.cookies.get("user_token");
  
  if (!token) {
    const response = NextResponse.json({ success: false, data:null, message: "No token provided" }, { status: 301 });
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  const answer = await TokenService.verify(token.value)

  if (!answer){
    const response =  NextResponse.json({ success: false, message: "Invalid token" }, { status: 403 });
    response.headers.set("Cache-Control", "no-store");
    return response;
  }

  const {user, email, role, id} = answer;

  const response_answer : AuthUser = {
    role: role,
    user: {
      id: id,
      email: email,
      profileName: user
    }
  }

  const response = NextResponse.json({
    success: true,
    data: response_answer,
    message: "User created successfully",
  });

  

  return response;
}
