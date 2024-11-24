import React, {useState} from "react";
import { SocialPost } from "@/components/custom/postwindow"
import { Post } from "@/utils/types/fe_types";

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
        {posts.map((post) => (
          <div
            key={post.id}
            className="relative overflow-hidden rounded-lg bg-gray-200 group"
            onClick={() => handlePhotoClick(post)}
            >
            <img
              src={post.mediafile}
              // src={'https://via.placeholder.com/300'}
              alt={post.description}
              className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {post.description}
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
    // <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
      // <div className="bg-white max-w-md w-full relative">
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center">
          <div className="bg-white w-[900px] h-[600px] max-w-full flex relative">
      <button
          onClick={onClose}
          className="absolute top-2 left-2 text-black bg-gray-200 rounded-full p-2 hover:bg-gray-300"
        >
          ✕
        </button>
        <SocialPost post={post} />
      </div>
    </div>
  );
};
  
  export default PostGrid;