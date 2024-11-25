'use client';
import { useUser } from "@/hooks/useUser";
import { Separator } from "@/components/ui/separator"
import PostGrid from "@/components/ui/postgrid";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { usePosts } from "@/hooks/usePosts";
import Navbar from "@/components/ui/navbar";
import CenteredAvatar from "@/components/custom/profileBox";
import { useGroups } from "@/hooks/useGroups";
import { GroupUser, GroupInfo } from "@/utils/types/fe_types";

function Profile() {
  const {user} = useUser();
  const { group } = useParams();
  const { get_group_posts } = usePosts();
  const { get_all_users, get_group_info, get_Pgroup_info } = useGroups();
  const [post_data, setPosts] = useState([]);
  const [users_in_group, setUsers] = useState<GroupUser[]>([]);
  const [group_info, setGroupInfo] = useState<GroupInfo | null>(null);
  const [Pgroup_info, setPGroupInfo] = useState<GroupUser[]>([]);


  useEffect(() => {
    if (group && !Array.isArray(group)) {
      get_group_posts(group).then((data) => {
        setPosts(data.data ? data.data : [])
      });
      get_all_users(group).then((data) => {
        setUsers(data.data ? data.data : [])
      });
      get_group_info(group).then((data) => {
        setGroupInfo(data.data ? data.data : {})
      });
      get_Pgroup_info(group).then((data) => {
        setPGroupInfo(data.data ? data.data : {})
      });

    }
  }, []);

  if (!group) {
    return <p>Loading group...</p>;
  }

  return (<>
    <Navbar />
    {group_info && Pgroup_info && <CenteredAvatar users={users_in_group} group={group_info} pending_users={Pgroup_info} />}
    <div className="border-t border-gray-300 my-2"></div>
    <main className="p-4">
      <PostGrid posts={post_data} role={user?.role ? user.role : ""}/>
    </main>
  </>)

};

export default Profile;
