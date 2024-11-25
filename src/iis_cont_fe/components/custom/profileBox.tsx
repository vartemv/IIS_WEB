import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useGroups } from '@/hooks/useGroups';
import { GroupInfo, GroupUser } from '@/utils/types/fe_types';
import { useEffect } from 'react';
import { useUser } from "@/hooks/useUser";

interface CenteredAvatarProps {
    users: GroupUser[];
    pending_users: GroupUser[];
    group: GroupInfo;
};

const CenteredAvatar: React.FC<CenteredAvatarProps> = ({ users, group, pending_users }) => {
    const {user} = useUser();
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
            <div className="flex items-center gap-7 p-8">
                {/* Avatar */}
                <Avatar className="hidden h-80 w-80 sm:flex rounded-full overflow-hidden">
                    <AvatarImage src={group.photo} alt="Avatar" />
                    <AvatarFallback>JL</AvatarFallback>
                </Avatar>
    
                {/* Group Info */}
                <div className="flex flex-col gap-2 item-start self-start">
                    <h3 className="text-6xl font-bold mt-10">{group.group_name}</h3>
                    <p className="text-3xl">Owner: {group.users.profile_name}</p>
                    <p className="text-2xl text-gray-600">Members: {group.pocet}</p>
                </div>
    
                {/* Dropdown Menus */}
    <div className="item-start self-start mt-12">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="border border-gray-300 rounded px-4 py-2 hover:bg-gray-100">
                    Users: {group.pocet}
                </button>
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
                                            src={user.photo || "https://via.placeholder.com/150"}
                                            alt={`${user.profile_name}'s photo`}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="text-sm font-medium">{user.profile_name}</div>
                                </div>
                                <div className="my-1 border-t" />
                            </React.Fragment>
                        ))}
                    </div>
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>

    {/* Dropdown Menu 2 */}
    {group.owner === user?.user.id && (
    <div className="item-start self-start mt-12">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="border border-gray-300 rounded px-4 py-2 hover:bg-gray-100">
                    Pending users: {pending_users_state.length}
                </button>
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
                                            src={p_user.photo || "https://via.placeholder.com/150"}
                                            alt={`${p_user.profile_name}'s photo`}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="text-sm font-medium">{p_user.profile_name}</div>
                                        <div className="flex gap-2 mt-1">
                                            <button
                                                onClick={() =>
                                                    handleChangeClick(p_user.id, group.group_name, "Active")
                                                }
                                                className="px-3 py-1 text-sm text-white bg-green-500 rounded hover:bg-green-600"
                                            >
                                                ✔️
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleChangeClick(p_user.id, group.group_name, "Refuse")
                                                }
                                                className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                                            >
                                                ✖
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="my-1 border-t" />
                            </React.Fragment>
                        ))}
                    </div>
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
)}
</div>
        </>
    );
};    

export default CenteredAvatar;