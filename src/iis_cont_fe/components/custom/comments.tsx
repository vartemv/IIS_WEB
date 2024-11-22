import * as React from 'react';

export interface CommentProps {
    avatarSrc: string;
    userName: string;
    comment: string;
  }

  export const Comment: React.FC<CommentProps> = ({ avatarSrc, userName, comment }) => (
    <article className="flex items-start gap-4 w-full">
      {/* Avatar */}
      <img
        loading="lazy"
        src={avatarSrc}
        alt={`${userName}'s avatar`}
        className="w-12 h-12 rounded-full object-cover"
      />
  
      {/* Content */}
      <div className="flex flex-col">
        {/* User Name */}
        <h3 className="text-lg font-semibold">{userName}</h3>
  
        {/* Comment Text */}
        <p className="text-sm text-gray-800">{comment}</p>
      </div>
    </article>
  );