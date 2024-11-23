import React from 'react';
import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { useGroups } from '@/hooks/useGroups';

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
            <a href={homePath} className="text-white hover:underline">
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
      <div className="flex items-center space-x-4">
        <a href="/cart" className="relative text-white">
          <i className="fas fa-shopping-cart"></i>
          <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">
            0
          </span>
        </a>
        <a href="/account" className="text-white">
          <i className="fas fa-user"></i>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;