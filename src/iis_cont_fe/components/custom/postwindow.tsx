import * as React from "react";
import { Comment } from "./comments";
import { PostHeader } from "./postheader";

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

export const SocialPost: React.FC = () => {
  return (
    <div className="flex w-full">
      {/* Left: Photo */}
      <div className="flex-shrink-0 w-1/2 max-w-md">
        <img
          loading="lazy"
        //   src="https://cdn.builder.io/api/v1/image/assets/TEMP/6b91db5a538fb19689b4564d5a070fe82a3c46a5c9122245402ef32533a623ac?apiKey=9822d2f548184319a14eb0b77089634c&"
          src="https://via.placeholder.com/600"
          alt="Silly frog photograph"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right: Post Info */}
      <div className="flex flex-col w-1/2 p-4">
        {/* Post Header */}
        <PostHeader
          title="Silly frog"
          authorName="Petr"
          authorAvatarSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/102e7422fd1c50853b0be3dc7486ed3da3bc6ee5799b80aff3e03a8b53ce67ae?apiKey=9822d2f548184319a14eb0b77089634c&"
          location="Forest"
          locationIconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/3f3015d7142edfce35dd12b8a537f40a71bcf75bc66ac19696401101f0395090?apiKey=9822d2f548184319a14eb0b77089634c&"
          timestamp="1 hour ago"
        />

        {/* Comments Section */}
        <div className="flex flex-col gap-4 overflow-y-auto max-h-96 my-4">
          {comments.map((comment, index) => (
            <Comment key={index} {...comment} />
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