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

        //Check if post exists and user is the owner
        const post = await prisma.posts.findUnique({
            where: { id: parseInt(id) },
        });

        if (!post) {
            return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
        }

        // Check if the current user is the post creator
        if (post.user_id !== user.id) {
            return NextResponse.json({ 
                success: false, 
                message: "You do not have permission to edit this post" 
            }, { status: 403 });
        }

        // Update the post
        const updatedPost = await prisma.posts.update({
            where: { id: parseInt(id) },
            data: {
                mediafile,
                description,
                location,
                availability: availability === 'TRUE',
            },
        });

        // Update tags
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

        // Delete existing group associations
        await prisma.group_posts.deleteMany({
            where: { post_id: parseInt(id) },
        });

        if (availability === 'TRUE') {
            for (const groupName of allowedGroups) {
                if (groupName) {
                    const groupRecord = await prisma.groups.findUnique({
                        where: { group_name: groupName },
                    });

                    if (!groupRecord) {
                        return NextResponse.json({ success: false, message: `The group '${groupName}' does not exist` }, { status: 400 });
                    }

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
            // Delete existing user permissions
            await prisma.user_posts.deleteMany({
                where: { post_id: parseInt(id) },
            });

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

            const postOwner = await prisma.users.findUnique({
                where: { id: user.id },
            });

            if (postOwner && !allowedUsersList.includes(postOwner.profile_name)) {
                allowedUsersList.push(postOwner.profile_name);
            }

            if (Array.isArray(allowedUsers)) {
                for (const user of allowedUsers) {
                    if (!allowedUsersList.includes(user)) {
                        allowedUsersList.push(user);
                    }
                }
            }

            for (const username of allowedUsersList) {
                if (username) {
                    const userRecord = await prisma.users.findUnique({
                        where: { profile_name: username },
                    });

                    if (!userRecord) {
                        return NextResponse.json({ success: false, message: `The user '${username}' does not exist` }, { status: 400 });
                    }

                    await prisma.user_posts.create({
                        data: {
                            post_id: parseInt(id),
                            id_of_user: userRecord.id,
                        },
                    });
                }
            }

            // Handle groups for private posts
            for (const groupName of allowedGroups) {
                if (groupName) {
                    const groupRecord = await prisma.groups.findUnique({
                        where: { group_name: groupName },
                    });

                    if (!groupRecord) {
                        return NextResponse.json({ success: false, message: `The group '${groupName}' does not exist` }, { status: 400 });
                    }

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