import axios from "axios";

const defaultCatch = (err) => {
  console.log(err, " <<-- error here");
  //console.log(err.response.data, " <<-- error data");
};

const apiClient = axios.create({
  baseURL: "https://muralmap-api.onrender.com/api",
});

export const fetchPosts = async (params = {}) => {
  return apiClient
    .get("posts", { params })
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
    defaultCatch(error);
  }
};

export const createPostAndSite = async (photoPayload, sitePayload) => {
  return apiClient
    .post("sites", { ...sitePayload })
    .then(({ data }) => {
      const site_id = data.site.site_id;
      return apiClient.post("posts", {
        ...photoPayload,
        site_id,
        created_at: Date.now(),
      });
    })
    .then(({ data }) => data)
    .catch(defaultCatch);
};

export const createPostOnSite = async (photoPayload) => {
  return apiClient
    .post("posts", { ...photoPayload, created_at: Date.now() })
    .then(({ data }) => data)
    .catch(defaultCatch);
};

export const fetchSiteBySiteId = async (site_id) => {
  try {
    const { data } = await apiClient.get(`sites/${site_id}`);
    return data;
  } catch (error) {
    defaultCatch(error);
  }
};

export const deletePostByPostId = async (post_id) => {
  try {
    await apiClient.delete(`posts/${post_id}`);
  } catch (error) {
    defaultCatch(error);
  }
};
