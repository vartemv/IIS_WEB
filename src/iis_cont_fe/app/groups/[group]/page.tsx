'use client';
import { useUser } from "@/hooks/useUser";
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
import PostGrid from "@/components/ui/postgrid";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { usePosts } from "@/hooks/usePosts";
import Navbar from "@/components/ui/navbar";

function Profile() {
  const { group } = useParams();
  const { get_group_posts } = usePosts();
  const [post_data, setPosts] = useState([]);

  useEffect(() => {
    if (group && !Array.isArray(group)) {
        get_group_posts(group).then((data) => {
        setPosts(data.data ? data.data : [])
      });
    }
  }, [group]);

  if (!group) {
    return <p>Loading group...</p>;
  }

  const posts = [
    { image: "https://via.placeholder.com/300", caption: "Post 1", author: "test" }
  ];
  return (<>
    <Navbar/>
    <div>
      <Separator className="my-4" />
    </div>
    <main className="p-4">
      <PostGrid posts={post_data} />
    </main>
  </>)

};

export default Profile;
