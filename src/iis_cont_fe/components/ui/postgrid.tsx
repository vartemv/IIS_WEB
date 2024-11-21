import React from "react";

interface Post {
  image: string;
  caption: string;
}

interface PostGridProps {
  posts: Post[];
}

// const PostGrid = ({ posts }) => {
//     return (
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
//         {posts.map((post, index) => (
//           <div
//             key={index}
//             className="relative overflow-hidden rounded-lg bg-gray-200 group"
//           >
//             <img
//               src={post.image}
//               alt={post.caption}
//               className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
//             />
//           </div>
//         ))}
//       </div>
//     );
//   };

  const PostGrid: React.FC<PostGridProps> = ({ posts }) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {posts.map((post, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-lg bg-gray-200 group"
          >
            <img
              src={post.image}
              alt={post.caption}
              className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {post.caption}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default PostGrid;