import React, { useEffect, useState } from "react";
import { SocialPost } from "@/components/custom/postwindow"
import { Post } from "@/utils/types/fe_types";
import { useRouter } from "next/navigation";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { usePosts } from "@/hooks/usePosts";

interface ModalProps {
  post: Post;
  onClose: () => void;
}

interface PostGridProps {
  posts: Post[];
  role: string;
  isProfilePage?: boolean;
  canEdit?: boolean;
}

const PostGrid: React.FC<PostGridProps> = ({ posts, role, isProfilePage = false, canEdit = false }) => {
  const [local_post, setPosts] = useState<Post[]>(posts);
  const { delete_post } = usePosts();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null); // Store selected post data
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility
  const router = useRouter();

  useEffect(() => {
    setPosts(posts);
  }, [posts])

  const handlePhotoClick = (post: Post) => {
    setSelectedPost(post); // Set the clicked post as the selected post
    setIsModalOpen(true);  // Open the modal
  };

  const handleEditClick = (postId: number) => {
    router.push(`/edit_post/${postId}`);
  };

  const handlePostDelete = (post_id: number, post_mediafile: string) => {
    delete_post(post_id, post_mediafile).then(() => {
      setPosts((prevPost) => prevPost.filter((post) => post.id !== post_id));
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {local_post.map((post) => (
        <div
          key={post.id}
          className="relative overflow-hidden rounded-lg bg-gray-200 group"
          onClick={() => handlePhotoClick(post)}>
          <ContextMenu>
            <ContextMenuTrigger>
              <img
                src={post.mediafile}
                alt={post.description}
                className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
              />
            </ContextMenuTrigger>
            <ContextMenuContent onClick={(e) => e.stopPropagation()} className="z-[9999] overflow-visible bg-white shadow-lg">
              {isProfilePage && canEdit && (
                <ContextMenuItem onClick={() => handleEditClick(post.id)}>Edit</ContextMenuItem>
              )}
              {(role === "Admin" || role === "Mod") && (
                <ContextMenuItem onClick={() => handlePostDelete(post.id, post.mediafile)}>Delete</ContextMenuItem>
              )}
            </ContextMenuContent>
          </ContextMenu>
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

const Modal: React.FC<ModalProps> = ({ post, onClose }) => {
  return (
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