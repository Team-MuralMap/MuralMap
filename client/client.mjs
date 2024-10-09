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

export const fetchPostById = async (post_id) => {
  return apiClient
    .get(`posts/${post_id}`)
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

export async function getCityByCoordinates(latitude, longitude) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.address) {
      const city =
        data.address.city || data.address.town || data.address.village || "";
      return city;
    } else {
      console.log(url);
      console.log(data);
      return "";
    }
  } catch (error) {
    console.error("Error fetching city:", error);
    return "";
  }
}

export async function fetchCityForSite(site_id) {
  const { site } = await fetchSiteBySiteId(site_id);
  const city = await getCityByCoordinates(site.latitude, site.longitude);
  return city;
}

export const addComment = async (post_id, user_id, body) => {
  const comment = { body: body,  user_id: user_id};

  return apiClient
    .post(`/posts/${post_id}/comments`, comment)
    .then(({ data }) => data)
    .catch(defaultCatch);
};