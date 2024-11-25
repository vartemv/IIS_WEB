import { NextRequest, NextResponse } from "next/server";
import prisma from 'db';
import { TokenService } from "@/app/utils/token";

export async function POST(req: NextRequest) {
    const token = req.cookies.get("user_token");
    if (!token) {
        return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 });
    }

    const user = await TokenService.verify(token.value);
    if (!user) {
        return NextResponse.json({ success: false, message: "Invalid token" }, { status: 403 });
    }

    if (user.role !== 'User' && user.role !== 'Admin' && user.role !== 'Mod') {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
      }

    try {
        const body = await req.json();
        const { mediafile, description, location, availability, tags, allowedUsers, allowedGroups } = body;

        const newPost = await prisma.posts.create({
            data: {
                user_id: user.id,
                datetime: new Date(),
                mediafile,
                description,
                location,
                availability: availability === 'TRUE', 
            },
        });

        await prisma.reactions.create({
            data: {
              id: newPost.id,
              post_id: newPost.id,
              amount: 0,
            }
          });

        
        if (tags && tags.length > 0) {
            for (const tag of tags) {
                let tagRecord = await prisma.tags.findFirst({
                    where: { name: tag },
                });

                if (!tagRecord) {
                    tagRecord = await prisma.tags.create({
                        data: { name: tag },
                    });
                }

                await prisma.post_tags.create({
                    data: {
                        post_id: newPost.id,
                        tag_id: tagRecord.id,
                    },
                });
            }
        }
        
        if (availability === 'TRUE') {
            for (const groupName of allowedGroups) {
                if(groupName){
                    const groupRecord = await prisma.groups.findUnique({
                        where: { group_name: groupName },
                    });
            
                    if (!groupRecord) {
                        return NextResponse.json({ success: false, message: `The group '${groupName}' does not exist` }, { status: 400 });
                    }
            
                    await prisma.group_posts.create({
                        data: {
                            group_name: groupName,
                            post_id: newPost.id,
                            datum: new Date(),
                        },
                    });
                }else{
                console.log("No group(s) selected");
            }
            }
        }
        
        
        if(availability === 'FALSE'){
        

            const userRecord = await prisma.users.findUnique({
                where: { id: user.id },
            });
            
            if (!userRecord) {
                console.error(`Invalid user ID: ${user.id}`);
                return NextResponse.json({ success: false, message: "Invalid user ID" }, { status: 400 });
            }
            
            
            const allowedUsersList: string[] = [];

                    
            const adminAndModUsers = await prisma.users.findMany({
                where: {
                    role: {
                        in: ['Admin', 'Mod'],
                    },
                },
                select: {
                    profile_name: true,
                },
            });
            
            adminAndModUsers.forEach((adminOrModUser) => {
                allowedUsersList.push(adminOrModUser.profile_name);
            });

            if (!allowedUsersList.includes(userRecord.profile_name)) {
                allowedUsersList.push(userRecord.profile_name);
            }
            
            

            if (Array.isArray(allowedUsers)) {
                for (const user of allowedUsers) {
                    if (!allowedUsersList.includes(user)) {  
                        allowedUsersList.push(user);
                    }
                }
                
            }
            
            for (const username of allowedUsersList) {
                if(username){
                    const userRecord = await prisma.users.findUnique({
                        where: { profile_name: username },
                    });
                
                    if (!userRecord ) {
                        return NextResponse.json({ success: false, message: `The user '${username}' does not exist` }, { status: 400 });
                    }
                
                    await prisma.user_posts.create({
                        data: {
                            post_id: newPost.id,
                            id_of_user: userRecord.id,
                        },
                    });
                }else{
                    console.log("No user(s) selected");
                }
            }
 
            for (const groupName of allowedGroups) {
                if(groupName){
                    const groupRecord = await prisma.groups.findUnique({
                        where: { group_name: groupName },
                    });
            
                    if (!groupRecord) {
                        return NextResponse.json({ success: false, message: `The group '${groupName}' does not exist` }, { status: 400 });
                    }
            
                    await prisma.group_posts.create({
                        data: {
                            group_name: groupName,
                            post_id: newPost.id,
                            datum: new Date(),
                        },
                    });
                }else{
                    console.log("No group(s) selected");
                }
            }
        }
        return NextResponse.json({ success: true, data: newPost, message: "Post created successfully" });
        } catch (error) {
            console.error("Error creating post:", error);
            return NextResponse.json({ success: false, message: "Failed to create post" }, { status: 500 });
        }
    }