import React from 'react';
import { useUser } from '@/hooks/useUser';

const Navbar: React.FC = () => {
  const { user } = useUser();
  const homePath = `/profile/${user?.user.profileName}`;
  return (
    <nav className="flex flex-col items-center bg-gray-800 h-16 text-white ">
      <div className="flex-shrink-0 absolute top-4 left-4">
        <a href="/info" className="text-xl font-bold text-white">
          FITstagram
        </a>
      </div>
      <div className="flex-grow flex flex-row items-center justify-center gap-6">
          <a href={user ? homePath : "/info"} className="text-white hover:underline">
            Home
          </a>
          <a href="/groups" className="text-white hover:underline">
            Groups
          </a>
          <a href="/create_post" className="text-white hover:underline">
            Create Post
          </a>
          <a href="/login" className="text-white hover:underline">
            Login
          </a>
      </div>
    </nav>
  );
};

export default Navbar;