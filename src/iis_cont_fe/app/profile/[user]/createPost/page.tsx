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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { MoveRight } from "lucide-react";
  import ImageUpload from "@/components/custom/image-upload";

function Profile() {
  const { user } = useParams();
  const { get_user_post } = usePosts();
  const [post_data, setPosts] = useState([]);

  useEffect(() => {
    if (user && !Array.isArray(user)) {
      get_user_post(user).then((data) => {
        console.log(data.data)
      });
    }
  }, [user]);

  if (!user) {
    return <p>Loading user...</p>;
  }

  const posts = [
    { image: "https://via.placeholder.com/300", caption: "Post 1", author: "test" }
  ];
  return (
    <main className="flex justify-center items-center min-h-screen flex-col space-y-4">
      <div className="flex gap-4">
            <div className="grid gap-4 py-4">
              <ImageUpload />
            </div>
      </div>
    </main>
  );
}

export default Profile;
