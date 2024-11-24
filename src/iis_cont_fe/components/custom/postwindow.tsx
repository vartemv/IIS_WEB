import * as React from "react";
import { CommentPart } from "./comments";
import { PostHeader } from "./postheader";
import { Post } from "@/utils/types/fe_types";

const comments = [
  {
    avatarSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/372cb138c0d17fe9aadf4e682f263f4b738a69cf9c6269dbdfea9d4343d386b0?apiKey=9822d2f548184319a14eb0b77089634c&",
    userName: "Adam",
    comment: "Nice picture!"
  },
  {
    avatarSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/372cb138c0d17fe9aadf4e682f263f4b738a69cf9c6269dbdfea9d4343d386b0?apiKey=9822d2f548184319a14eb0b77089634c&",
    userName: "Tomas",
    comment: "Cool!"
  },
  {
    avatarSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/372cb138c0d17fe9aadf4e682f263f4b738a69cf9c6269dbdfea9d4343d386b0?apiKey=9822d2f548184319a14eb0b77089634c&",
    userName: "Tomas",
    comment: "Cool!"
  },
  {
    avatarSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/372cb138c0d17fe9aadf4e682f263f4b738a69cf9c6269dbdfea9d4343d386b0?apiKey=9822d2f548184319a14eb0b77089634c&",
    userName: "Tomas",
    comment: "Cool!"
  },
  {
    avatarSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/372cb138c0d17fe9aadf4e682f263f4b738a69cf9c6269dbdfea9d4343d386b0?apiKey=9822d2f548184319a14eb0b77089634c&",
    userName: "Tomas",
    comment: "Cool!"
  },
  {
    avatarSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/372cb138c0d17fe9aadf4e682f263f4b738a69cf9c6269dbdfea9d4343d386b0?apiKey=9822d2f548184319a14eb0b77089634c&",
    userName: "Tomas",
    comment: "Cool!"
  },
  {
    avatarSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/372cb138c0d17fe9aadf4e682f263f4b738a69cf9c6269dbdfea9d4343d386b0?apiKey=9822d2f548184319a14eb0b77089634c&",
    userName: "Tomas",
    comment: "Cool!"
  },
  {
    avatarSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/372cb138c0d17fe9aadf4e682f263f4b738a69cf9c6269dbdfea9d4343d386b0?apiKey=9822d2f548184319a14eb0b77089634c&",
    userName: "Tomas",
    comment: "Cool!"
  }
];

export const SocialPost: React.FC<{post: Post}> = ({post}) => {
  return (
    <div className="flex w-full">
      {/* Left: Photo */}
      <div className="flex-shrink-0 w-1/2 max-w-md">
        <img
          loading="lazy"
          // src={post.mediafile}
          src="https://via.placeholder.com/600"
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
          {post.comments.map((comment ,index) => (
            <CommentPart key={index} comment={comment} />
          ))}
        </div>

        {/* Add Comment Form (Fixed at Bottom) */}
        <form className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg mt-auto">
          <input
            type="text"
            placeholder="Add a comment..."
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