import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import React, { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useGroups } from '@/hooks/useGroups';
import { GroupInfo, GroupUser } from '@/utils/types/fe_types';
import { CSSProperties } from 'react';

const tags = Array.from({ length: 50 }).map(
    (_, i, a) => `v1.2.0-beta.${a.length - i}`
)

interface CenteredAvatarProps {
    users: GroupUser[];
    pending_users: GroupUser[];
    group: GroupInfo;
};

const CenteredAvatar: React.FC<CenteredAvatarProps> = ({ users, group, pending_users }) => {
    return (
        <>
            <div style={styles.container}>
                <Avatar className="hidden h-28 w-28 sm:flex">
                    <AvatarImage src="https://picsum.photos/seed/picsum/200/300" alt="Avatar" />
                    <AvatarFallback>JL</AvatarFallback>
                </Avatar>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">Users: {group.pocet}</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <ScrollArea className="h-72 w-30 rounded-md border">
                            <div className="p-4">
                                <h4 className="mb-4 text-sm font-medium text-center">Group Members</h4>
                                {users.map((user) => (
                                    <React.Fragment key={user.id}>
                                        <div className="flex items-center gap-3 py-2">
                                            <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-300">
                                                <img
                                                    src={user.photo || "https://via.placeholder.com/150"} // Placeholder image if photo is missing
                                                    alt={`${user.profile_name}'s photo`}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="text-sm font-medium">{user.profile_name}</div>
                                        </div>
                                        <Separator className="my-1" />
                                    </React.Fragment>
                                ))}
                            </div>
                        </ScrollArea>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div style={styles.secondDropdownContainer}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">Users: {group.pocet}</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <ScrollArea className="h-72 w-30 rounded-md border">
                            <div className="p-4">
                                <h4 className="mb-4 text-sm font-medium text-center">Pending users</h4>
                                {pending_users.map((p_user) => (
                                    <React.Fragment key={p_user.id}>
                                        <div className="flex items-center gap-3 py-2">
                                            <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-300">
                                                <img
                                                    src={p_user.photo || "https://via.placeholder.com/150"} // Placeholder image if photo is missing
                                                    alt={`${p_user.profile_name}'s photo`}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="text-sm font-medium">{p_user.profile_name}</div>
                                        </div>
                                        <Separator className="my-1" />
                                    </React.Fragment>
                                ))}
                            </div>
                        </ScrollArea>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
    );
};

const styles: {[key: string]: CSSProperties} = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        gap: '10px',
        height: '200px',
    },
    avatarContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
    },
    secondDropdownContainer: {
        position: 'absolute',
        top: '100px',
        right: '120px', // Adjust distance to the right of the avatar
        zIndex: 10,
    },
};

export default CenteredAvatar;