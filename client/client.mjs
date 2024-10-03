import axios from "axios";

const defaultCatch = (err) => {
  console.log(err.response.data);
};

const apiClient = axios.create({
  baseURL: "https://muralmap-api.onrender.com/api",
});

export const fetchPosts = async () => {
  return apiClient
    .get("posts")
    .then(({ data }) => data)
    .catch(defaultCatch);
};

export const fetchUsers = async () => {
  return apiClient
    .get("users")
    .then(({ data }) => data)
    .catch(defaultCatch);
};

export const fetchSites = async () => {
  return apiClient
    .get("sites")
    .then(({ data }) => data)
    .catch(defaultCatch);
};

export const fetchCommentsByPostId = async (post_id) => {
  try {
    const { data } = await apiClient.get(`posts/${post_id}/comments`);
    return data;
  } catch (error) {
    return [];
  }
};

export const fetchUserByUserId = async (user_id) => {
  try {
    const { data } = await apiClient.get(`users/${user_id}`);
    return data;
  } catch (error) {
      defaultCatch(error);
  }
};
