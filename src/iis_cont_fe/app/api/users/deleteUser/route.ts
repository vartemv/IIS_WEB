import { NextRequest, NextResponse } from 'next/server';
import prisma  from 'db';
import { TokenService } from '@/app/utils/token';

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json(); // Parse the request body
        const { user_id } = body;
        const token = req.cookies.get("user_token");
        if (!token) {
            return NextResponse.json({ success: false, data: null, message: "No token provided" }, { status: 301 });
        }
    
        const sender = await TokenService.verify(token.value)
    
        if (!sender || sender.role != "Admin") {
            return NextResponse.json({ success: false, data: null, message: "Invalid token" }, { status: 403 });
        }

        if (!user_id) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User ID is required.',
                },
                { status: 400 }
            );
        }

        const result = await prisma.users.delete({
            where: {
                    id:user_id
                }
            },
        );

        if (result) {
            return NextResponse.json(
                {
                    success: true,
                    message: 'User deleted successfully.',
                },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                {
                    success: false,
                    message: 'User not found.',
                },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error.',
            },
            { status: 500 }
        );
    }
}