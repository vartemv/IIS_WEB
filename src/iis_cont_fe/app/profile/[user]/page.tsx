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
  const { user: currentUser } = useUser(); 
  const { user: profileUser } = useParams(); 
  const { get_user_post } = usePosts();
  const [post_data, setPosts] = useState([]);

  useEffect(() => {
    if (profileUser && !Array.isArray(profileUser)) {
      get_user_post(profileUser).then((data) => {
        console.log(data.data)
        setPosts(data.data)
      });
    }
  }, [profileUser]);

  if (!profileUser) {
    return <p>Loading user...</p>;
  }

  
  const isOwnProfile = currentUser?.user.profileName === profileUser;

  return (<>
    <Navbar/>
    <div>
      <Separator className="my-4" />
    </div>
    <main className="p-4">
      <PostGrid 
        posts={post_data} 
        isProfilePage={true}
        canEdit={isOwnProfile}
      />
    </main>
  </>)
};

export default Profile;