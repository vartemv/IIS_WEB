'use client';

import { useUser } from "@/hooks/useUser"
import NavigationMenuComponent from "@/components/ui/navbarmain";
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import PostGrid from "../../components/ui/postgrid";
import Navbar from "../../components/ui/navbar";
import { useEffect, useState } from "react";
import { usePosts } from "@/hooks/usePosts";

export default function TextareaDemo() {
    const { get_all_posts } = usePosts();
    const [post_data, setPosts] = useState([]);

  useEffect(() => {
    get_all_posts().then((data) => {
      console.log(data.data)
      setPosts(data.data)
    });
  }, []);

    const posts = [
      { id: 1, image: "https://via.placeholder.com/300", caption: "Post 0", author: "Test" },
      { id: 2, image: "https://via.placeholder.com/600", caption: "Post 1", author: "Test" },
      { id: 3, image: "https://via.placeholder.com/300", caption: "Post 2", author: "Test" },
      { id: 4, image: "https://via.placeholder.com/400", caption: "Post 3", author: "Test" },
      { id: 5, image: "https://via.placeholder.com/400", caption: "Post 4", author: "Test" }
    ];
    // return <ResizablePanelGroup direction="horizontal">
    //             <ResizablePanel> Cookie-user: <pre>{JSON.stringify(user, undefined, 4)}</pre> </ResizablePanel>
    //         </ResizablePanelGroup>
    return (<>
    <div>
      <Navbar />
    </div>
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
    <main className="p-1">
      {/* Pass the posts to PostGrid */}
      <PostGrid posts={post_data} />
      </main>
    </>)
  
}