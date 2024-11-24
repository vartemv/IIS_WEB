"use client"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"

import { useEffect, useState } from "react";
import { useMediaUser } from "@/hooks/useUsers";
import { User } from "@/utils/types/fe_types";

export default function TableDemo() {
    const [users, setUsers] = useState<User[]>([]);
    const { get_users, change_role, delete_user } = useMediaUser();

    useEffect(() => {
        get_users().then((data) => {
            setUsers(data.data);
        });
    }, [])

    const handleRoleChange = async ({ role, user_id }: { role: string; user_id: number }) => {
        await change_role({role: role, user_id: user_id});
    };

    const handleDelete = async (user_id: number ) => {
        const response = await delete_user(user_id);
        if(response.success)
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== user_id));
        else
            console.error('Failed to delete user:', response.message);
    };

    return (
        <Table>
            <TableCaption>All users of FITstagram</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Sign-Up date</TableHead>
                    <TableHead>Role</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.profile_name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.first_name} {user.last_name}</TableCell>
                        <TableCell>{new Date(user.sign_up_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                            <Select onValueChange={(value) => handleRoleChange({ role: value, user_id: user.id})}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder={user.role} />
                                </SelectTrigger>
                                <SelectContent className="bg-white shadow-lg">
                                    <SelectItem value="User">User</SelectItem>
                                    <SelectItem value="Admin">Admin</SelectItem>
                                    <SelectItem value="Mod">Mod</SelectItem>
                                </SelectContent>
                            </Select>
                        </TableCell>
                        <TableCell><Button onClick={()=> handleDelete(user.id)}variant="destructive">Delete</Button></TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                </TableRow>
            </TableFooter>
        </Table>
    )
}
