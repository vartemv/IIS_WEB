import { NextRequest, NextResponse } from 'next/server';
import prisma from 'db';
import { DateProcessor } from '@/app/utils/date';
import { TokenService } from '@/app/utils/token';

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("user_token");
        const body = await req.json();
        const { post_id, liked } = body;

        if ( !post_id ) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }
        
        if (!token) {
            return NextResponse.json({ success: false, data: null, message: "No token provided" }, { status: 301 });
        }
    
        const sender = await TokenService.verify(token.value)
    
        if (!sender) {
            return NextResponse.json({ success: false, data: null, message: "Invalid token" }, { status: 403 });
        }

        let newAmount;

        if (liked) {
            await prisma.user_reactions.create({
                data: {
                    id_of_user: sender.id,
                    post_id: post_id
                },
            });

            const reaction = await prisma.reactions.upsert({
                where: { id : post_id, post_id: post_id},
                update: { amount: { increment: 1 } },
                create: { post_id: post_id, amount: 1 },
            });

            newAmount = reaction.amount;
        } else {
            await prisma.user_reactions.delete({
                where: {
                    id_of_user_post_id: {
                        id_of_user: sender.id,
                        post_id: post_id,
                    },
                }
            });

            const reaction = await prisma.reactions.update({
                where: { id : post_id, post_id: post_id },
                data: { amount: { decrement: 1 } },
            });

            newAmount = reaction.amount;
        }


        
        return NextResponse.json({success: true, message: "Reaction added", data: newAmount});
    } catch (error) {
        console.log(` ${error} Error in POST handler:`);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}
