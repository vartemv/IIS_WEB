import * as React from 'react';
import { Comment, CommentUsersPhoto } from "@/utils/types/fe_types";

  export const CommentPart: React.FC<{ comment: Comment}> = ({ comment }) => (
    <article className="flex items-start gap-4 w-full">
      {/* Avatar */}
      <img
        loading="lazy"
        // src={comment.users.photo}
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/372cb138c0d17fe9aadf4e682f263f4b738a69cf9c6269dbdfea9d4343d386b0?apiKey=9822d2f548184319a14eb0b77089634c&"
        // alt={`${userName}'s avatar`}
        className="w-12 h-12 rounded-full object-cover"
      />
  
      {/* Content */}
      <div className="flex flex-col">
        {/* User Name */}
        <h3 className="text-lg font-semibold">{comment.author}</h3>
  
        {/* Comment Text */}
        <p className="text-sm text-gray-800">{comment.content}</p>
      </div>
    </article>
  );