import React, {useState} from "react";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Group } from "@/utils/types/fe_types";

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

    const handlePhotoClick = (group: Group) => {
      setSelectedPost(group); // Set the clicked post as the selected post
      setIsModalOpen(true);  // Open the modal
    };

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {groups.map((group, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-lg bg-gray-200 group"
            onClick={() => handlePhotoClick(group)}
            >
            <img
              // src={post.mediafile}
              src={'https://via.placeholder.com/300'}
              alt={group.group_name}
              className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {group.group_name}
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