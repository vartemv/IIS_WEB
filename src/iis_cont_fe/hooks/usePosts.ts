import axios from "axios";

export const usePosts = () => {
const get_user_post = async (profile_name: string) => {
    return await axios
    .get(`/api/data/getPosts?user=${profile_name}`)
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
      return { success: false, data: null, message: "Failed to fetch posts." };
    });
  }

  return { get_user_post};
}