import React from 'react';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from 'react';
import { useUser } from '@/hooks/useUser';

const Navbar: React.FC = () => {
  const {user} = useUser();
  const homePath = `/profile/${user?.user.profileName}`;
  const [name, setName] = useState("");
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
            <Sheet>
              <SheetTrigger asChild>
                <a className="text-white hover:underline">
                  Create Group
                </a>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Create new group</SheetTitle>
                  <SheetDescription>
                    Create your own FITgroup
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                  </div>
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button type="submit">Create group</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
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