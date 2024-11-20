import { NextResponse, NextRequest } from "next/server";
import { TokenService } from "@/app/utils/token";
import { AuthUser } from '@/utils/types/auth'; 

export async function GET(req: NextRequest) {
  const token = req.cookies.get("user_token");

  if (!token) {
    return NextResponse.json({ success: false, message: "No token provided" }, { status: 301 });
  }

  const answer = await TokenService.verify(token.value)

  if (!answer){
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 403 });
  }

  const {user, email, role} = answer;

  const response_answer : AuthUser = {
    role: role,
    user: {
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

//   try {
//     const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
//     const user = await prisma.users.findUnique({
//       where: { email: decoded.email },
//     });

//     if (!user) {
//       return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json({
//       success: true,
//       data: {
//         email: user.email,
//         firstName: user.first_name,
//         lastName: user.last_name,
//         profile_name: user.profile_name,
//         isAdmin: user.is_admin, // Ensure your database has an `is_admin` field
//       },
//     });
//   } catch (err) {
//     return NextResponse.json({ success: false, message: "Invalid token" }, { status: 403 });
//   }
}
