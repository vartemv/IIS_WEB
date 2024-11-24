import axios from "axios";
import { profile } from "console";

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

    const get_group_posts = async (group_name: string) => {
        return await axios
        .get(`/api/data/getGroupPosts?group=${group_name}`)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            return { success: false, data: null, message: "Failed to fetch post." };
        }
    )
    }
    
    const get_posts_by_tag = async (tag: string) => {
        return await axios
          .get(`/api/data/getPostsByTag?tag=${tag}`)
          .then((res) => {
            return res.data;
          })
          .catch((err) => {
            return { success: false, data: null, message: "Failed to fetch posts by tag." };
          });
      };

      const post_comment = async (content: string, post_id: number) => {
        try {
            const response = await axios.post('/api/data/createComment', { content, post_id }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (err) {
            console.error("Error posting comment:", err);
            return { success: false, data: null, message: "Failed to post comment." };
        }
    }
    
      return { get_user_post, get_all_posts, get_group_posts, get_posts_by_tag, post_comment};
}