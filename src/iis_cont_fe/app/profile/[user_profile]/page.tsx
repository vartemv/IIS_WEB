'use client';
import { useUser } from "@/hooks/useUser";
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import PostGrid from "@/components/ui/postgrid";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { usePosts } from "@/hooks/usePosts";
import { useMediaUser } from "@/hooks/useUsers";
import Navbar from "@/components/ui/navbar";
import { User } from "@/utils/types/fe_types";

function Profile() {
  const {user} = useUser();
  const [user_info, setUser] = useState<User | null>(null);
  const { get_user } = useMediaUser();
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
      
      get_user().then((data) => {
        console.log(data.data)
        const us_info = data.data ? data.data : [];
        setUser(us_info);
      });
    }
  }, []);
  
  const isOwnProfile = user?.user.profileName === user_profile;

  return (<>
    <Navbar/>
    <div className="flex items-center gap-7 p-8">
      {/* Avatar */}
      <Avatar className="hidden h-80 w-80 sm:flex rounded-full overflow-hidden">
        <AvatarImage src={user_info?.photo} alt="Avatar" />
        <AvatarFallback>JL</AvatarFallback>
      </Avatar>
      
      {/* Group Info */}
      <div className="flex flex-col gap-2 item-start self-start">
        <h3 className="text-6xl font-bold mt-10">{user_info?.first_name} {user_info?.last_name}</h3>
        <p className="text-3xl">{user_info?.profile_name}</p>
        <p className="text-2xl text-gray-600">{user_info?.email}</p>
      </div>
    </div>
    <div className="border-t border-gray-300 my-2"></div>
    <main className="p-4">
      <PostGrid posts={post_data} role={user?.role ? user.role : ""} isProfilePage={true} canEdit={isOwnProfile}/>
    </main>
  </>)

};

export default Profile;