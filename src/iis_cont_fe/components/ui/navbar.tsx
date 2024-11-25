import React from 'react';
import { useUser } from '@/hooks/useUser';

const Navbar: React.FC = () => {
  const {user} = useUser();
  const homePath = `/profile/${user?.user.profileName}`;
  return (
    <nav className="flex justify-between items-center bg-gray-800 text-white p-4">
      <div className="flex-shrink-0">
        <a href="/info" className="text-xl font-bold text-white">
          FITstagram
        </a>
      </div>
      <div className="flex-grow">
        <ul className="flex space-x-4 justify-center list-none m-0 p-0">
          <li>
            <a href={user ? homePath : "/info"} className="text-white hover:underline">
              Home
            </a>
          </li>
          <li>
          </li>
          <li>
            <a href="/groups" className="text-white hover:underline">
              Groups
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;