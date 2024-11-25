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
  const {user} = useUser();
  const { user_profile } = useParams();
  const { get_user_post } = usePosts();
  const [post_data, setPosts] = useState([]);

  useEffect(() => {
    if (user_profile && !Array.isArray(user_profile)) {
      get_user_post(user_profile).then((data) => {
        console.log(data.data)
        const posts = data.data ? data.data : [];
        setPosts(posts);
      });
    }
  }, []);
  
  const isOwnProfile = user?.user.profileName === user_profile;

  return (<>
    <Navbar/>
    <div>
      <Separator className="my-4" />
    </div>
    <main className="p-4">
    <PostGrid posts={post_data} role={user?.role ? user.role : ""} isProfilePage={true} canEdit={isOwnProfile}/>
    </main>
  </>)

};

export default Profile;