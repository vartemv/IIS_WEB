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

interface Post {
  id: number;
  image: string;
  author: string;
  caption: string;
  // ALL POST INFO: title, comments, etc.
}

interface ModalProps {
  post: Post;
  onClose: () => void;
}

interface PostGridProps {
  posts: Post[];
}

  const PostGrid: React.FC<PostGridProps> = ({ posts }) => {

    const [selectedPost, setSelectedPost] = useState<Post | null>(null); // Store selected post data
    const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility

    const handlePhotoClick = (post: Post) => {
      setSelectedPost(post); // Set the clicked post as the selected post
      setIsModalOpen(true);  // Open the modal
    };

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {posts.map((post, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-lg bg-gray-200 group"
            onClick={() => handlePhotoClick(post)}
            >
            <img
              src={post.image}
              alt={post.caption}
              className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {post.caption}
            </div>
          </div>
          
        ))}

        {isModalOpen && selectedPost && (
          <Modal post={selectedPost} onClose={() => setIsModalOpen(false)} />
        )}
      </div>
    );
  };

  const Modal: React.FC<ModalProps> = ({ post , onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Photo */}
        <img
          src={post.image}
          // alt={post.title}
          className="w-full h-64 object-cover rounded-md mb-4"
        />

        {/* <h2 className="text-xl font-semibold">{post.title}</h2> */}
        {/* <p className="text-gray-700 mt-2">{post.description}</p> */}
        <h2 className="text-xl font-semibold">POST INFO</h2>
        <p className="text-gray-700 mt-2">TODO ALL THIS</p>
      </div>
    </div>
  );
};
  
  export default PostGrid;