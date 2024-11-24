import React, { useState, useEffect} from "react";
import { Group } from "@/utils/types/fe_types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useGroups } from '@/hooks/useGroups';

interface ModalProps {
  group: Group;
  onClose: () => void;
}

interface GroupGridProps {
  groups: Group[];
}

  const GroupGrid: React.FC<GroupGridProps> = ({ groups }) => {
    const {send_request} = useGroups();
    const [allGroups, setGroups] = useState<Group[]>(groups);
    const router = useRouter();

    useEffect(() => {
      setGroups(groups);
  }, [groups]);

    const handlePhotoClick = (group: Group) => {
      router.push(`groups/${group.group_name}`);
    };

    const handleJoinGroup = async (group_name: string) => {
      const updatedGroups = allGroups.map((group) =>
        group.group_name === group_name ? { ...group, user_status: 'Pending' } : group
      );
      setGroups(updatedGroups);
      const response = await send_request( group_name );

      if (response.success) {
            // redrawing can also be here
        } else {
            console.log("Failed to join group", response.message);
        }
    };

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 p-4">
    {allGroups?.map((group, index) => (
      <div
        key={index}
        onClick={() => handlePhotoClick(group)}
        className="flex items-center justify-between rounded-xl border p-2 max-w-[500px] bg-gray-200 hover:bg-gray-300 transition duration-200"
      >
        {/* Left side: Avatar and Group Information */}
        <div className="flex items-center space-x-4">
          <Avatar className="hidden h-28 w-28 sm:flex">
            <AvatarImage src={group.photo} alt="Avatar" />
            {/* <AvatarImage src="https://picsum.photos/seed/picsum/200/300" alt="Avatar" /> */}
            <AvatarFallback>JL</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-2xl font-bold leading-none">{group.group_name}</p>
            <p className="text-xl text-muted-foreground">{group.users.profile_name}</p>
            <p className="text-lg text-muted-foreground">Subscribers: {group.pocet}</p>
          </div>
        </div>

        {/* Right side: Join button */}
        <div>
            {group.user_status === null && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleJoinGroup(group.group_name);
                }}
                className="ml-auto mr-2 px-6 py-3 bg-green-500 text-xl font-bold text-white rounded-full hover:bg-green-600 transition duration-200">
                Join
              </button>
            )}
            {group.user_status === 'Pending' && (
              <span className="ml-auto mr-2 px-3 py-3 bg-gray-500 text-xl font-bold text-white rounded-full">
                On wait
              </span>
            )}
            {/* Do nothing if user_status === "Active" */}
          </div>
      </div>
    ))}
  </div>
);
};
  
  export default GroupGrid;