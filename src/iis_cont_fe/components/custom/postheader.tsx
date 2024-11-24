import * as React from 'react';
import { Post } from "@/utils/types/fe_types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const PostHeader: React.FC<{ post: Post }> = ({ post }) => (
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
          // src={post.users.profile_name}
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/102e7422fd1c50853b0be3dc7486ed3da3bc6ee5799b80aff3e03a8b53ce67ae?apiKey=9822d2f548184319a14eb0b77089634c&"
          className="w-12 h-12 rounded-full object-cover"
        />
        <span className="text-lg font-semibold">{post.users.profile_name}</span>
      </div>

      {/* Right side: Location and Timestamp */}
      <div className="flex flex-col items-end gap-2 text-sm text-gray-600">
        {/* Location */}
        <div className="flex items-center gap-2">
          <img
            loading="lazy"
            // TODO location icon
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/3f3015d7142edfce35dd12b8a537f40a71bcf75bc66ac19696401101f0395090?apiKey=9822d2f548184319a14eb0b77089634c&"
            alt=""
            className="w-5 h-5"
          />
          <span>{post.location}</span>
        </div>

        {/* Timestamp */}
        <time className="text-xs text-gray-500">{post.datetime}</time>
      </div>
    </div>
  </header>
);