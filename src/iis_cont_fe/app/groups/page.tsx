'use client';

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Navbar from "../../components/ui/navbar";
import { useEffect, useState, useRef } from "react";
import GroupGrid from "@/components/custom/groupsGrid";
import { Group } from "@/utils/types/fe_types";
import { useGroups } from "@/hooks/useGroups";
import { useUser } from "@/hooks/useUser";

export default function TextareaDemo() {
    const { user } = useUser();
    const [name, setName] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { get_all_groups, create_group, get_all_my_groups, get_all_in_groups } = useGroups();
    const [group_data, setGroups] = useState<Group[]>([]);
    const [my_group_data, setMyGroups] = useState<Group[]>([]);
    const [in_group_data, setInGroups] = useState<Group[]>([]);
    const [refreshData, setRefreshData] = useState(false);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setImagePreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async () => {
        if (!file || file.size > 10 * 1024 * 1024) { // 10MB limit
            setErrorMessage("File is required and must be under 10MB");
            return;
        }

        // Validate allowed file types
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            setErrorMessage("Invalid file type. Only JPEG, PNG, and GIF are allowed.");
            return;
        }

        try {
            if (file) {
                const formDataWithFile = new FormData();
                const timestamp = Date.now();
                const filename = `/${timestamp}_${file.name.replaceAll(" ", "_")}`;
                formDataWithFile.append('file', new File([file], filename, { type: file.type }));

                const response = await create_group({ group_name: name, photo: filename });
                if (response.success) {
                    const uploadResponse = await fetch('/api/savePost', {
                        method: 'POST',
                        body: formDataWithFile
                    });
                    if (uploadResponse.ok) {
                        console.log('Group created successfully');
                        setErrorMessage(null);
                        setFile(null);
                        setImagePreview(null);
                        if (fileRef.current) {
                            fileRef.current.value = '';
                        }
                    }
                } else {
                    setErrorMessage(response.message);
                    return; 
                }
            }

            setRefreshData((prev) => !prev);
            setIsSheetOpen(false); // Close the sheet after refreshing data

        } catch (error) {
            console.error("Error creating group:", error);
            setErrorMessage('An error occurred while creating the group');
        }
    };

    useEffect(() => {
        get_all_groups().then((data) => {
            setGroups(data.data ? data.data : []);
        });

        get_all_my_groups().then((data) => {
            setMyGroups(data.data ? data.data : []);
        });

        get_all_in_groups().then((data) => {
            setInGroups(data.data ? data.data : []);
        });

    }, [refreshData]);

    return (<>
        <div>
            <Navbar />
        </div>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
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
                <div className="flex flex-col gap-5 py-4">
                    {errorMessage && (
                        <p className="text-red-500 text-sm col-span-4">{errorMessage}</p>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="flex justify-center items-center w-full">
                        <div className="w-full max-w-sm gap-4 border-2 border-dashed border-gray-400 p-6 flex flex-col items-center ">
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
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                    onClick={() => fileRef.current?.click()}
                                >
                                    Add image
                                </button>
                            </label>
                        </div>
                    </div>
                </div>
                <SheetFooter>
                    <Button
                        onClick={async () => {
                            await handleSubmit();
                        }}
                        type="submit"
                    >
                        Create group
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
        <div className="text-3xl font-bold leading-none tracking-tight pt-5 pl-5">
            My Groups
        </div>
        <GroupGrid groups={my_group_data} role={user?.role ? user.role : ""} />
        <div className="text-3xl font-bold leading-none tracking-tight pt-5 pl-5">
            Groups I'm in
        </div>
        <GroupGrid groups={in_group_data} role={user?.role ? user.role : ""} />
        <div className="text-3xl font-bold leading-none tracking-tight pt-5 pl-5">
            Groups
        </div>
        <GroupGrid groups={group_data} role={user?.role ? user.role : ""} />
    </>);
}