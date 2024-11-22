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

    return { get_all_groups };
}