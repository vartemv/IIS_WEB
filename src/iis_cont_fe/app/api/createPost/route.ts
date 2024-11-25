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

        if (allowedGroups && allowedGroups.length > 0) {
            for (const groupName of allowedGroups) {
                if (groupName) {
                    const groupRecord = await prisma.groups.findUnique({
                        where: { group_name: groupName },
                    });
                    
                    if (!groupRecord) {
                        return NextResponse.json({ 
                            success: false, 
                            message: `The group '${groupName}' does not exist` 
                        }, { status: 400 });
                    }

                    const userGroupStatus = await prisma.user_groups.findFirst({
                        where: {
                            group_name: groupName,
                            id_of_user: user.id,
                            status: "Active"
                        }
                    });

                    if (!userGroupStatus) {
                        return NextResponse.json({
                            success: false,
                            message: `You don't have permission to post in group '${groupName}'. You must be an active member.`
                        }, { status: 403 });
                    }
                }
            }
        }


        if (availability === 'FALSE' && allowedUsers && allowedUsers.length > 0) {
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
            
            adminAndModUsers.forEach(user => allowedUsersList.push(user.profile_name));
            
            const postOwner = await prisma.users.findUnique({
                where: { id: user.id },
                select: { profile_name: true }
            });
            
            if (postOwner){ 
                allowedUsersList.push(postOwner.profile_name);
            }
            
            
            
            for (const username of allowedUsersList) {
                if(!allowedUsers.includes(username)){
                allowedUsers.push(username);
                }
            }
            console.log('hmm:', allowedUsers);

            for (const username of allowedUsers) {
                console.log(username);
                if (username && !allowedUsers.includes(username)) {
                    console.log("here2");
                    const userExists = await prisma.users.findUnique({
                        where: { profile_name: username }
                    });
                    
                    if (!userExists) {
                        console.log("here3");
                        return NextResponse.json({
                            success: false,
                            message: `User '${username}' does not exist`
                        }, { status: 400 });
                    }
                    console.log(username);
                    allowedUsers.push(username);
                }
            }
        }


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

        
        if (allowedGroups && allowedGroups.length > 0) {
            for (const groupName of allowedGroups) {
                if (groupName) {
                    await prisma.group_posts.create({
                        data: {
                            group_name: groupName,
                            post_id: newPost.id,
                            datum: new Date(),
                        },
                    });
                }
            }
        }

        if (availability === 'FALSE' && allowedUsers && allowedUsers.length > 0) {
            for (const username of allowedUsers) {
                if (username) {
                    const userRecord = await prisma.users.findUnique({
                        where: { profile_name: username },
                    });

                    if (userRecord) {
                        await prisma.user_posts.create({
                            data: {
                                post_id: newPost.id,
                                id_of_user: userRecord.id,
                            },
                        });
                    }
                }
            }
        }

        return NextResponse.json({
            success: true,
            data: newPost,
            message: "Post created successfully"
        });

    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to create post"
        }, { status: 500 });
    }
}