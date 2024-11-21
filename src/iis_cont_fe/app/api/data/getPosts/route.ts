import { NextRequest, NextResponse } from "next/server";
import { TokenService } from "@/app/utils/token";

export async function GET(req: NextRequest)
{
    const token = req.cookies.get("user_token");

    if (!token) {
        return NextResponse.json({ success: false, data:null, message: "No token provided" }, { status: 301 });
      }
    
      const answer = await TokenService.verify(token.value)
    
      if (!answer){
        return NextResponse.json({ success: false, data:null, message: "Invalid token" }, { status: 403 });
      }

    const { searchParams } = new URL(req.url);
    if(searchParams){
        const user = searchParams.get("user");
        console.log(`User is ${user}`)
    }

    const response_answer = {data: "smth"};
    
    const response = NextResponse.json({
        success: true,
        data: response_answer,
        message: "User created successfully",
      });

      return response;
};