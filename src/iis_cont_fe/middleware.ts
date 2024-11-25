import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { TokenService } from './app/utils/token';
import axios from 'axios';


export async function middleware(request: NextRequest) {
    const token = request.cookies.get('user_token');

    if (!token) {
        console.log("No token")
        return NextResponse.redirect(new URL('/login', request.url))
    }
    const user_data = await TokenService.verify(token.value);

    if (!user_data) {
        console.log("No data")
        return NextResponse.redirect(new URL('/login', request.url))
    }

    const { role } = user_data;

    const path = request.nextUrl.pathname; 

    if (path.startsWith('/admin')) {
        if (role !== "Admin") {
            return NextResponse.redirect(new URL('/info', request.url))
        }
    }
    if(path.startsWith('/groups/')){
        const groupName = path.split('/')[2];
        
        if(groupName){
            const response = await axios.get(`http://localhost:3000/api/group/userIsActive?group=${groupName}`, {
                headers: {
                    Authorization: `Bearer ${token.value}` // Pass the token in the Authorization header
                }
            })
            if(!response.data.data){
                return NextResponse.redirect(new URL('/groups', request.url))
            }
        }
    }
}

export const config = {
    matcher: ['/admin', '/groups/:path*'],
}