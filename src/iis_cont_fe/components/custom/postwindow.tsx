import React, { useState } from "react";
import { CommentPart } from "./comments";
import { PostHeader } from "./postheader";
import { Post, Comment } from "@/utils/types/fe_types";
import { usePosts } from '@/hooks/usePosts';
import { useUser } from "@/hooks/useUser"


export const SocialPost: React.FC<{post: Post}> = ({post}) => {
  const {user} = useUser();
  const {post_comment} = usePosts();
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.comments);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      setNewComment("");
      return;
    }

    if (!user) {
      alert("You need to register or log in to post a comment.");
      setNewComment("");
      return;
    }

    const response = await post_comment( newComment, post.id );
    console.log(response);

    if (response.success) {
      setComments(response.data);
      setNewComment("");
    } else {
      alert(response.message);
      console.log("Failed to post comment");
    }
  };

  return (
    <div className="flex w-full">
      {/* Left: Photo */}
      <div className="flex-shrink-0 w-1/2 max-w-md">
        <img
          loading="lazy"
          src={post.mediafile}
          alt={post.description}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right: Post Info */}
      <div className="flex flex-col w-1/2 p-4">
        {/* Post Header */}
        <PostHeader post={post}/>
        <div className="border-t border-gray-300 my-2"></div>
        {/* Comments Section */}
        <div className="flex flex-col gap-4 overflow-y-auto max-h-96 my-4">
          {comments.map((comment ,index) => (
            <CommentPart key={index} comment={comment} />
          ))}
        </div>

        {/* Add Comment Form (Fixed at Bottom) */}
        <form onSubmit={handleCommentSubmit} className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg mt-auto">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 p-2 text-sm bg-transparent border-none outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};