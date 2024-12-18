import axios from "axios";
import { GroupCreate, GroupInfo, UserStatus } from "@/utils/types/fe_types";
import { group } from "console";

export const useGroups = () => {
    const get_all_groups = async () => {
        return await axios
            .get(`/api/group/getAllGroups`)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return { success: false, data: null, message: "Failed to fetch posts." };
            });
    }

    const create_group = async (group_info: GroupCreate) => {
        return await axios
            .post(`/api/group/createGroup`, group_info)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return { success: false, data: null };
            })
    }

    const get_all_my_groups = async () => {
        return await axios
            .get(`/api/group/getAllMyGroups`)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return { success: false, data: null, message: "Failed to retrieve my groups." };
            })
    }

    const get_all_in_groups = async () => {
        return await axios
            .get(`/api/group/getGroupsIn`)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return { success: false, data: null, message: "Failed to retrieve in groups." };
            })
    }

    const get_all_users = async (group_name: string) => {
        return await axios
            .get(`/api/group/getUsersInGroup?group=${group_name}`)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return { success: false, data: null, message: "Failed to retrieve in groups." };
            })
    }

    const get_group_info = async (group_name: string) => {
        return await axios
            .get(`/api/group/getGroupInfo?group=${group_name}`)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return { success: false, data: null, message: "Failed to retrieve in groups." };
            })
    }

    const get_Pgroup_info = async (group_name: string) => {
        return await axios
            .get(`/api/group/getPendingUsers?group=${group_name}`)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return { success: false, data: null, message: "Failed to retrieve pending users." };
            })
    }

    const change_status = async (new_status: UserStatus) => {
        return await axios
            .post(`/api/group/changeUserStatus`, new_status)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return { success: false, data: null, message: "Failed to retrieve pending users." };
            })
    }

    const send_request = async (group_name: string) => {
        return await axios
            .post(`/api/group/sendJoinRequest`, { group_name })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return { success: false, data: null, message: "Failed to send request." };
            })
    }

    const delete_group = async (group_name: string, photo: string) => {
        return await axios
            .delete(`/api/group/deleteGroup`, { data: { group_name, photo } })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return { success: false, data: null, message: "Failed to delete group." };
            })
    }

    return { get_all_groups, create_group, get_all_my_groups, get_all_in_groups, get_all_users, get_group_info, get_Pgroup_info, change_status, send_request, delete_group };
}