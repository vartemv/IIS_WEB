import axios from "axios";

import { ChangeRole } from "@/utils/types/fe_types";

export const useMediaUser = () => {

    const get_users = async () => {
        return await axios
            .get(`/api/users/getAllUsers`)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return { success: false, data: null, message: "Failed to fetch posts." };
            });
    }
    
    const change_role = async (new_status: ChangeRole) => {
        return await axios
            .post(`/api/users/changeUserRole`, new_status)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return { success: false, data: null, message: "Failed to fetch posts." };
            });
    }

    const delete_user = async (user_id: number) => {
        return await axios
            .delete(`/api/users/deleteUser`, {data: {user_id}})
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return { success: false, data: null, message: "Failed to fetch posts." };
            });
    }

  return { get_users, change_role, delete_user };
};