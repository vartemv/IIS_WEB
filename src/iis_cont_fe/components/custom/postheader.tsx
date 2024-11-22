import * as React from 'react';
  
  export interface PostHeaderProps {
    title: string;
    authorName: string;
    authorAvatarSrc: string;
    location: string;
    locationIconSrc: string;
    timestamp: string;
  }

export const PostHeader: React.FC<PostHeaderProps> = ({
  title,
  authorName,
  authorAvatarSrc,
  location,
  locationIconSrc,
  timestamp
}) => (
    <header className="flex flex-col gap-2 text-black w-full">
    {/* Title and Author Info */}
    <div className="flex items-center justify-between">
      {/* Title */}
      <h1 className="text-2xl font-bold truncate">{title}</h1>

      {/* Author */}
      <div className="flex items-center gap-4">
        <img
          loading="lazy"
          src={authorAvatarSrc}
          alt={`${authorName}'s avatar`}
          className="w-12 h-12 rounded-full object-cover"
        />
        <span className="text-lg font-semibold truncate">{authorName}</span>
      </div>
    </div>

    {/* Location */}
    <div className="flex items-center gap-2 text-gray-600 text-sm">
      <img
        loading="lazy"
        src={locationIconSrc}
        alt=""
        className="w-5 h-5"
      />
      <span>{location}</span>
    </div>

    {/* Timestamp */}
    <time className="text-xs text-gray-500">{timestamp}</time>
  </header>
);