import { NextRequest, NextResponse } from "next/server";
import prisma from 'db';
import { TokenService } from "@/app/utils/token";


export async function PUT(req: NextRequest) {
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
        const { id, mediafile, description, location, availability, tags, allowedUsers, allowedGroups } = body;

        if (!id) {
            return NextResponse.json({ success: false, message: "Post ID is required" }, { status: 400 });
        }

        const post = await prisma.posts.findUnique({
            where: { id: parseInt(id) },
        });

        if (!post) {
            return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
        }

        if (post.user_id !== user.id) {
            return NextResponse.json({ 
                success: false, 
                message: "You do not have permission to edit this post" 
            }, { status: 403 });
        }

        
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
            
            // Add post owner
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

        
        const updatedPost = await prisma.posts.update({
            where: { id: parseInt(id) },
            data: {
                mediafile,
                description,
                location,
                availability: availability === 'TRUE',
            },
        });

        
        await prisma.post_tags.deleteMany({
            where: { post_id: parseInt(id) },
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
                        post_id: parseInt(id),
                        tag_id: tagRecord.id,
                    },
                });
            }
        }

        
        await prisma.group_posts.deleteMany({
            where: { post_id: parseInt(id) },
        });

        if (allowedGroups && allowedGroups.length > 0) {
            for (const groupName of allowedGroups) {
                if (groupName) {
                    await prisma.group_posts.create({
                        data: {
                            group_name: groupName,
                            post_id: parseInt(id),
                            datum: new Date(),
                        },
                    });
                }
            }
        }

        
        if (availability === 'FALSE') {
            await prisma.user_posts.deleteMany({
                where: { post_id: parseInt(id) },
            });

            if (allowedUsers && allowedUsers.length > 0) {
                for (const username of allowedUsers) {
                    if (username) {
                        const userRecord = await prisma.users.findUnique({
                            where: { profile_name: username },
                        });

                        if (userRecord) {
                            await prisma.user_posts.create({
                                data: {
                                    post_id: parseInt(id),
                                    id_of_user: userRecord.id,
                                },
                            });
                        }
                    }
                }
            }
        }

        return NextResponse.json({ 
            success: true, 
            data: updatedPost, 
            message: "Post updated successfully" 
        });

    } catch (error) {
        console.error("Error updating post:", error);
        return NextResponse.json({ 
            success: false, 
            message: "Failed to update post" 
        }, { status: 500 });
    }
}