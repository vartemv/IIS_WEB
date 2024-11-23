import axios from "axios";

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

    const create_group = async (group_name: string) => {
        return await axios
        .post(`/api/group/createGroup`, {group_name})
        .then((res)=>{
            return res.data;
        })
        .catch((err) => {
            return { success: false, data: null, message: "Failed to create group." };
        })
    }

    const get_all_my_groups = async () => {
        return await axios
        .get(`/api/group/getAllMyGroups`)
        .then((res)=>{
            return res.data;
        })
        .catch((err) => {
            return { success: false, data: null, message: "Failed to retrieve my groups." };
        })
    }

    const get_all_in_groups = async () => {
        return await axios
        .get(`/api/group/getGroupsIn`)
        .then((res)=>{
            return res.data;
        })
        .catch((err) => {
            return { success: false, data: null, message: "Failed to retrieve my groups." };
        })
    }

    return { get_all_groups, create_group, get_all_my_groups, get_all_in_groups };
}