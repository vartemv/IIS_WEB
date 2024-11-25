import React, { useState } from "react";
import { Post } from "@/utils/types/fe_types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { usePosts } from '@/hooks/usePosts';
import { useUser } from "@/hooks/useUser"

export const PostHeader: React.FC<{ post: Post }> = ({ post }) => {
  const {user} = useUser();
  const {post_reaction} = usePosts();
  const [liked, setLiked] = useState(post.user_reaction?.reacted ?? false);
  const [reactionsCount, setReactionsCount] = useState(post.reactions[0].amount);

  const handleLike = async () => {
    if (!user) {
      alert("You need to register or log in to like a post.");
      return;
    }
    setLiked(!liked);
    setReactionsCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1));
    
    const response = await post_reaction( post.id, !liked );
    
    if (response.success && response.data !== undefined) {
      setReactionsCount(response.data);
    } else {
      setLiked(!liked);
      setReactionsCount((prevCount) => (liked ? prevCount + 1 : prevCount - 1));
      console.log('Failed to update reaction.');
    }
  };

  
  return (
  <header className="flex flex-col gap-2 text-black w-full">
    <div className="flex justify-between items-start w-full">
      {/* Title (Description) */}
      <h1 className="text-2xl font-bold break-words whitespace-normal w-full sm:w-auto">
        {post.description}
      </h1>

      {/* Dropdown Menu for Tags */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Tags</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="flex flex-col gap-2">
            {Array.isArray(post.post_tags) && post.post_tags.map((postTag) => (
              <DropdownMenuItem key={postTag.tag_id} className="px-2 py-1 bg-gray-200 rounded">
                <a href={`/tags/${postTag.tags.name}`} className="text-black no-underline">
                  {postTag.tags.name}
                </a>
              </DropdownMenuItem>
            ))}
            {/* <DropdownMenuItem className="px-2 py-1 bg-gray-200 rounded">
              swag
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    {/* Profile and Info Section */}
    <div className="flex items-center justify-between gap-4 w-full">
      {/* Left side: Profile Image and Name */}
      <div className="flex items-center gap-4">
        <img
          loading="lazy"
          src={post.users.photo ? post.users.photo : "/user.png"}
          alt="user"
          className="w-16 h-16 rounded-full object-cover image-rendering-auto"
        />
        <span className="text-xl font-semibold">{post.users.profile_name}</span>
      </div>

      {/* Right side: Location and Timestamp */}
      <div className="flex flex-col items-end gap-2 text-sm text-gray-600">
        {/* Location */}
        <div className="flex items-center gap-2">
          <img
            loading="lazy"
            src="/location_icon.png"
            alt=""
            className="w-5 h-5"
          />
          <span>{post.location}</span>
        </div>

        {/* Timestamp */}
        <time className="text-xs text-gray-500">{post.datetime}</time>
      </div>
    </div>
    {/* Reaction Counter and Heart Button */}
    <div className="flex items-center justify-end gap-2">
      {/* Heart Button */}
      <button
      onClick={() => handleLike()}
      className="w-7 h-7" >
        <img
        src={liked ? "/heart_liked.png" : "/heart.png"}
        alt="reaction heart"
        className="w-full h-full" />
      </button>
      {/* Reaction Count */}
      <span className="text-xl font_bold text-gray-700">{reactionsCount}</span>
      </div>
  </header>
);
}