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
      setPosts(data.data ? data.data : [])
    });
  }, []);

    return (<>
    <div>
      <Navbar />
    </div>
    <main className="p-1">
      <PostGrid posts={post_data} />
      </main>
    </>)
  
}