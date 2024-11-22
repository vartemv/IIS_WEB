import axios from "axios";

export const usePosts = () => {
  const get_all_posts = async () => {
    return await axios
        .get(`/api/data/getAllPosts`)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return { success: false, data: null, message: "Failed to fetch posts." };
        });
}
    const get_user_post = async (profile_name: string) => {
        return await axios
            .get(`/api/data/getPosts?user=${profile_name}`)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return { success: false, data: null, message: "Failed to fetch post." };
            });
    }

    return { get_user_post, get_all_posts };
}