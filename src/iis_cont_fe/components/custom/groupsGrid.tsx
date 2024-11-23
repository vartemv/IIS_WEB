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
      setSelectedPost(group); // Set the clicked post as the selected post
      router.push(`groups/${group.group_name}`);
    };

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {groups.map((group, index) => (
          <div key={index} className="flex items-center gap-4">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage src="https://picsum.photos/seed/picsum/200/300" alt="Avatar" />
            <AvatarFallback>JL</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-bold leading-none">Jackson Lee</p>
            <p className="text-sm text-muted-foreground">jackson.lee@email.com</p>
          </div>
        </div>
          
        ))}

        {isModalOpen && selectedPost && (
          <Modal group={selectedPost} onClose={() => setIsModalOpen(false)} />
        )}
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