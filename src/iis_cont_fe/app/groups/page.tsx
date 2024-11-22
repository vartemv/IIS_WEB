'use client';

import { useUser } from "@/hooks/useUser"
import NavigationMenuComponent from "@/components/ui/navbarmain";
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import PostGrid from "../../components/ui/postgrid";
import Navbar from "../../components/ui/navbar";
import { useEffect, useState } from "react";
import { usePosts } from "@/hooks/usePosts";
import GroupGrid from "@/components/custom/groupsGrid";
import { Group } from "@/utils/types/fe_types";
import { useGroups } from "@/hooks/useGroups";

export default function TextareaDemo() {
    const { get_all_groups } = useGroups();
    const [group_data, setGroups] = useState<Group[]>([]);

    useEffect(() => {
        get_all_groups().then((data) => {
            console.log(data)
            setGroups(data.data)
        });
    }, []);
    // return <ResizablePanelGroup direction="horizontal">
    //             <ResizablePanel> Cookie-user: <pre>{JSON.stringify(user, undefined, 4)}</pre> </ResizablePanel>
    //         </ResizablePanelGroup>
    return (<>
        <div>
            <Navbar />
            {/* <NavigationMenuComponent /> */}
        </div>
        {/* <main className="p-4">
            {/* Pass the posts to PostGrid
            <GroupGrid groups={group_data} />
        </main> */}
        <div className="text-2xl font-semibold leading-none tracking-tight">
            My Groups
        </div>
        <div className="text-2xl font-semibold leading-none tracking-tight">
            Groups I'm in
        </div>
        <div className="text-2xl font-semibold leading-none tracking-tight">
            Groups
        </div>
    </>)

}