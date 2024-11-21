import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { TokenService } from './app/utils/token';
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = request.cookies.get('user_token');
    

    if(!token){
        console.log("No token")
        return NextResponse.redirect(new URL('/login', request.url))
}
    const user_data = await TokenService.verify(token.value);
    
    if (!user_data){
        console.log("No data")
        return NextResponse.redirect(new URL('/login', request.url))
    }
    
    const {role} = user_data;

}

export const config = {
    matcher: ['/admin', '/profile'],
  }