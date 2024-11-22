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
import { useAuth } from "@/hooks/useAuth";
import { useParams } from "next/navigation";

function Profile(){
    const {user} = useParams();
    const{get_data} = useAuth();
    const[post_data, setPosts] = useState([]);
    
    useEffect(() => {
      if(user && !Array.isArray(user)){
        get_data(user).then((data)=>{
          console.log(data.data)
        });
      }
      }, [user]);

      if(!user){
        return <p>Loading user...</p>; 
      }

    const posts = [
        { image: "https://via.placeholder.com/300", caption: "Post 1", author:"test" }
      ];
      return (<>
        <NavigationMenu>
          <NavigationMenuList>
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
      </div>
      <main className="p-4">
          <PostGrid posts={post_data} />
    </main>
      </>)

};

export default Profile;
