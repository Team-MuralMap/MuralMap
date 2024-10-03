import axios from "axios";

const defaultCatch = (err) => {
  console.log(err.response.data);
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

export const createPostWithSite = async (photoPayload, sitePayload) => {
  return apiClient
    .post("sites", { ...sitePayload })
    .then(({ data }) => {
      const site_id = data.site.site_id;
      return apiClient.post("posts", { ...photoPayload, site_id });
    })
    .catch(defaultCatch);
};
