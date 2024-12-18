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

    const post_reaction = async (post_id: number, liked: boolean) => {
        try {
            const response = await axios.post('/api/data/createReaction', { post_id, liked }, {
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

    const delete_post = async (post_id: number, file_name: string) => {
        return await axios
            .delete('/api/data/deletePost', { data: {post_id, file_name} })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return { success: false, data: null, message: "Failed to delete post" };
            });
    }

    const get_post_by_id = async (post_id: string) => {
        return await axios
            .get(`/api/data/getPost?id=${post_id}`)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                return { success: false, data: null, message: "Failed to fetch post." };
            });
    }

    return { get_user_post, get_all_posts, get_group_posts, get_posts_by_tag, post_comment, post_reaction, delete_post, get_post_by_id };
}