'use client';

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser } from "@/hooks/useUser"
import NavigationMenuComponent from "@/components/ui/navbarmain";
import { Separator } from "@/components/ui/separator"
import PostGrid from "../../components/ui/postgrid";
import Navbar from "../../components/ui/navbar";
import { useEffect, useState } from "react";
import { usePosts } from "@/hooks/usePosts";
import GroupGrid from "@/components/custom/groupsGrid";
import { Group } from "@/utils/types/fe_types";
import { useGroups } from "@/hooks/useGroups";

export default function TextareaDemo() {
    const { get_all_groups, create_group, get_all_my_groups, get_all_in_groups } = useGroups();
    const [group_data, setGroups] = useState<Group[]>([]);
    const [my_group_data, setMyGroups] = useState<Group[]>([]);
    const [in_group_data, setInGroups] = useState<Group[]>([]);
    const [name, setName] = useState("");

    useEffect(() => {
        get_all_groups().then((data) => {
            console.log("ALL GROUPS");
            console.log(data.data);
            setGroups(data.data)
        });

        get_all_my_groups().then((data)=>{
            console.log("MY GROUPS");
            console.log(data.data);
            setMyGroups(data.data);
        });

        get_all_in_groups().then((data)=>{
            console.log("GROUPS I AM IN");
            console.log(data.data);
            setInGroups(data.data);
        });

    }, []);

    const handleCreateGroup = async () => {
        if (!name) return; // Avoid submitting if name is empty

        const response = await create_group(name); // Call the create_group function

        if (response.success) {
            // If the group is created successfully, refresh the groups
            get_all_groups().then((data) => {
                setGroups(data.data); // Update the group list after creating a new group
            });
        } else {
            console.error("Failed to create group:", response.message);
        }

        setName(""); // Clear the input after creating a group
    };
    // return <ResizablePanelGroup direction="horizontal">
    //             <ResizablePanel> Cookie-user: <pre>{JSON.stringify(user, undefined, 4)}</pre> </ResizablePanel>
    //         </ResizablePanelGroup>
    return (<>
        <div>
            <Navbar />
        </div>

        <Sheet>
            <SheetTrigger asChild>
                <button
                    className="absolute top-2 right-4 bg-blue-500 text-white rounded-full p-2 text-xl hover:bg-blue-600 transition-colors"
                    aria-label="Create group"
                >
                    +
                </button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Create new group</SheetTitle>
                    <SheetDescription>
                        Create your own FITgroup
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                    </div>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button onClick= {()=>handleCreateGroup()}type="submit">Create group</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
        <div className="text-2xl font-semibold leading-none tracking-tight">
            My Groups
        </div>
        <GroupGrid groups={my_group_data} />
        <div className="text-2xl font-semibold leading-none tracking-tight">
            Groups I'm in
        </div>
        <GroupGrid groups={in_group_data} />
        <div className="text-2xl font-semibold leading-none tracking-tight">
            Groups
        </div>
        <GroupGrid groups={group_data} />
    </>)

}