'use client';

import { useUser } from "@/hooks/useUser"
import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import PostGrid from "../../components/ui/postgrid";
import Navbar from "../../components/ui/navbar";

export default function TextareaDemo() {
    const { user } = useUser();
    const posts = [
      { id: 1, image: "https://via.placeholder.com/300", caption: "Post 0", author: "Test" },
      { id: 2, image: "https://via.placeholder.com/300", caption: "Post 1", author: "Test" },
      { id: 3, image: "https://via.placeholder.com/300", caption: "Post 2", author: "Test" },
      { id: 4, image: "https://via.placeholder.com/400", caption: "Post 3", author: "Test" },
      { id: 5, image: "https://via.placeholder.com/300", caption: "Post 4", author: "Test" },
      { id: 6, image: "https://via.placeholder.com/300", caption: "Post 4", author: "Test" },
      { id: 7, image: "https://via.placeholder.com/400", caption: "Post 4", author: "Test" },
      { id: 8, image: "https://via.placeholder.com/500", caption: "Post 4", author: "Test" },
      { id: 9, image: "https://via.placeholder.com/300", caption: "Post 4", author: "Test" },
    ];
    // return <ResizablePanelGroup direction="horizontal">
    //             <ResizablePanel> Cookie-user: <pre>{JSON.stringify(user, undefined, 4)}</pre> </ResizablePanel>
    //         </ResizablePanelGroup>
    return (<>
    {/* <Navbar /> */}
      <NavigationMenu>
        <NavigationMenuList>
        <NavigationMenuItem>
            <Link href="/docs" legacyBehavior passHref className="text-xl font-bold text-white">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                <p className="text-xl font-bold">
                  FITstagram
                  </p>
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/docs" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/docs" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Create Post
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/docs" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Create Group
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
        <Input type="search" placeholder="Search"/>
      </NavigationMenu>
      <div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
    <main className="p-4">
      {/* Pass the posts to PostGrid */}
      <PostGrid posts={posts} />
      </main>
    </>)
  
}