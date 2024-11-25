'use client';

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Navbar from "../../components/ui/navbar";
import { useEffect, useState } from "react";
import GroupGrid from "@/components/custom/groupsGrid";
import { Group, GroupInfo } from "@/utils/types/fe_types";
import { useGroups } from "@/hooks/useGroups";
import { useRef } from "react";

export default function TextareaDemo() {
    const [name, setName] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { get_all_groups, create_group, get_all_my_groups, get_all_in_groups } = useGroups();
    const [group_data, setGroups] = useState<Group[]>([]);
    const [my_group_data, setMyGroups] = useState<Group[]>([]);
    const [in_group_data, setInGroups] = useState<Group[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setImagePreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async () => {
        
        if (!file || file.size > 10 * 1024 * 1024) { // 10MB limit
            console.error("File is required and must be under 10MB");
            return;
        }

        // Validate allowed file types
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            console.error("Invalid file type");
            return;
        }

        try {
            if (file) {
                const formDataWithFile = new FormData();
                const timestamp = Date.now();
                const filename = `${timestamp}_${file.name.replaceAll(" ", "_")}`;
                formDataWithFile.append('file', new File([file], filename, { type: file.type }));

                const response = await create_group({group_name: name, photo:filename});
                
                
                if (response.success) {
                    const uploadResponse = await fetch('/api/savePost', {
                        method: 'POST',
                        body: formDataWithFile
                    });
                    if (uploadResponse.ok) {
                        console.log('Group created successfully');
                        setErrorMessage(null);
                        // Reset form
                        setFile(null);
                        setImagePreview(null);
                        if (fileRef.current) {
                            fileRef.current.value = '';
                        }

                    }
                } else {
                    // Display error message from server
                    setErrorMessage(response.message || 'Failed to create post');
                    return; // Don't proceed with file upload if post creation failed
                }

            }
        } catch (error) {
            console.error("Error creating post:", error);
            setErrorMessage('An error occurred while creating the post');

        }
    };

    useEffect(() => {
        get_all_groups().then((data) => {
            console.log("ALL GROUPS");
            console.log(data.data);
            setGroups(data.data ? data.data : [])
        });

        get_all_my_groups().then((data) => {
            console.log("MY GROUPS");
            console.log(data.data);
            setMyGroups(data.data ? data.data : []);
        });

        get_all_in_groups().then((data) => {
            console.log("GROUPS I AM IN");
            console.log(data.data);
            setInGroups(data.data ? data.data : []);
        });

    }, []);

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
                        <div className="flex justify-center items-center w-1/2">
                            <div className="w-full max-w-sm border-2 border-dashed border-gray-400 p-5 flex flex-col items-center justify-center">
                                {imagePreview && (
                                    <img src={imagePreview} alt="Selected file" className="mt-4 max-w-full h-auto" />
                                )}
                                <label className="cursor-pointer">
                                    <input
                                        type="file"
                                        className="hidden"
                                        ref={fileRef}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                    />
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md mt-4"
                                        onClick={() => fileRef.current?.click()}
                                    >
                                        Add image
                                    </button>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button onClick={() => handleSubmit()} type="submit">Create group</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
        <div className="text-3xl font-bold leading-none tracking-tight pt-5 pl-5">
            My Groups
        </div>
        <GroupGrid groups={my_group_data} />
        <div className="text-3xl font-bold leading-none tracking-tight pt-5 pl-5">
            Groups I'm in
        </div>
        <GroupGrid groups={in_group_data} />
        <div className="text-3xl font-bold leading-none tracking-tight pt-5 pl-5">
            Groups
        </div>
        <GroupGrid groups={group_data} />
    </>)

}