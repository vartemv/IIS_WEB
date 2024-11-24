import React, {useState} from "react";
import { Group } from "@/utils/types/fe_types";
import NavigationMenuComponent from "../ui/navbarmain";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

interface ModalProps {
  group: Group;
  onClose: () => void;
}

interface GroupGridProps {
  groups: Group[];
}

  const GroupGrid: React.FC<GroupGridProps> = ({ groups }) => {

    const [selectedPost, setSelectedPost] = useState<Group | null>(null); // Store selected post data
    const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility
    const router = useRouter();

    const handlePhotoClick = (group: Group) => {
      // setSelectedPost(group); // Set the clicked post as the selected post
      router.push(`groups/${group.group_name}`);
    };

    const handleJoinGroup = (group: Group) => {
      alert("TODO additing user to Pending");
      // setSelectedPost(group); // Set the clicked post as the selected post
      // router.push(`groups/${group.group_name}`);
    };

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 p-4">
    {groups?.map((group, index) => (
      <div
        key={index}
        onClick={() => handlePhotoClick(group)}
        className="flex items-center justify-between rounded-md border p-2 max-w-[500px] bg-gray-200 hover:bg-gray-300 transition duration-200"
      >
        {/* Left side: Avatar and Group Information */}
        <div className="flex items-center space-x-4">
          <Avatar className="hidden h-28 w-28 sm:flex">
            {/* <AvatarImage src={group.photo} alt="Avatar" /> */}
            <AvatarImage src="https://picsum.photos/seed/picsum/200/300" alt="Avatar" />
            <AvatarFallback>JL</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-2xl font-bold leading-none">{group.group_name}</p>
            <p className="text-xl text-muted-foreground">{group.users.profile_name}</p>
            <p className="text-lg text-muted-foreground">Subscribers: {group.pocet}</p>
          </div>
        </div>

        {/* Right side: Join button */}
        {group.user_status === null && (
          <button
            onClick={(e) => { e.stopPropagation(); handleJoinGroup(group); }}
            className="ml-auto mr-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-200">
            Join
          </button>
        )}
      </div>
    ))}
  </div>
);
};

  const Modal: React.FC<ModalProps> = ({ group , onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
      
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Photo */}
        <img
          // src={post.mediafile}
          src={'https://via.placeholder.com/300'}
          alt={group.group_name}
          className="w-full h-64 object-cover rounded-md mb-4"
        />

        {/* <h2 className="text-xl font-semibold">{post.title}</h2> */}
        {/* <p className="text-gray-700 mt-2">{post.description}</p> */}
        <h2 className="text-xl font-semibold">Subscribers:</h2>
        <p className="text-gray-700 mt-2">{group.pocet}</p>
      </div>
    </div>
  );
};
  
  export default GroupGrid;