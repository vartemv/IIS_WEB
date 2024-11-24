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
import { useEffect } from 'react';

const tags = Array.from({ length: 50 }).map(
    (_, i, a) => `v1.2.0-beta.${a.length - i}`
)

interface CenteredAvatarProps {
    users: GroupUser[];
    pending_users: GroupUser[];
    group: GroupInfo;
};

const CenteredAvatar: React.FC<CenteredAvatarProps> = ({ users, group, pending_users }) => {
    const {change_status} = useGroups();
    const [pending_users_state, setPendingUsers] = useState<GroupUser[]>(pending_users);

    useEffect(() => {
        setPendingUsers(pending_users);
    }, [pending_users]);

    const handleChangeClick = async (user_id: number, group_name: string, status: string) => {
        const response = await change_status({user_id: user_id, group_name: group_name, status: status});

        if (response.success) {
            // If the group is created successfully, refresh the groups
            const index = pending_users_state.findIndex(user=>user.id === user_id);
            if(index != -1){
                setPendingUsers(prevState => prevState.filter(user => user.id !== user_id));
            }
        } else {
            console.error("Failed to change status", response.message);
        }
    };

    return (
        <>
            <div style={styles.container}>
                <Avatar className="hidden h-28 w-28 sm:flex">
                    {/* <AvatarImage src="https://picsum.photos/seed/picsum/200/300" alt="Avatar" /> */}
                    <AvatarImage src={group.photo} alt="Avatar" />
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
                        <Button variant="outline">Pending users: {pending_users_state.length}</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <ScrollArea className="h-72 w-30 rounded-md border">
                            <div className="p-4">
                                <h4 className="mb-4 text-sm font-medium text-center">List</h4>
                                {pending_users_state.map((p_user) => (
                                    <React.Fragment key={p_user.id}>
                                        <div className="flex items-center gap-3 py-2">
                                            <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-300">
                                                <img
                                                    src={p_user.photo || "https://via.placeholder.com/150"} // Placeholder image if photo is missing
                                                    alt={`${p_user.profile_name}'s photo`}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <div className="text-sm font-medium">{p_user.profile_name}</div>
                                                <div className="flex gap-2 mt-1">
                                                    <button onClick={()=>handleChangeClick(p_user.id, group.group_name, "Active")}
                                                        className="px-3 py-1 text-sm text-white bg-green-500 bg-black rounded hover:bg-green-600"
                                                         // Replace with your approve handler
                                                    >
                                                        ✔️
                                                    </button>
                                                    <button onClick={()=>handleChangeClick(p_user.id, group.group_name, "Refuse")}
                                                        className="px-3 py-1 text-sm text-black bg-red-500  rounded hover:bg-red-600"
                                                         // Replace with your decline handler
                                                    >
                                                        ✖
                                                    </button>
                                                </div>
                                            </div>
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

const styles: { [key: string]: CSSProperties } = {
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