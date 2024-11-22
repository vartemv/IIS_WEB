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
            {/* <Navbar /> */}
            <NavigationMenuComponent />
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
        <main className="p-4">
            {/* Pass the posts to PostGrid */}
            <GroupGrid groups={group_data} />
        </main>
    </>)

}