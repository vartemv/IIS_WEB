import * as React from 'react';
import { Comment, CommentUsersPhoto } from "@/utils/types/fe_types";

  export const CommentPart: React.FC<{ comment: Comment}> = ({ comment }) => (
    <article className="flex items-start gap-4 w-full">
      {/* Avatar */}
      <img
        loading="lazy"
        src={comment.users.photo ? comment.users.photo : "/user.png"}
        alt="user"
        className="w-12 h-12 rounded-full object-cover image-rendering-auto"
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