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
        .post(`/api/group/createGroup`, group_name)
    }

    return { get_all_groups, create_group };
}