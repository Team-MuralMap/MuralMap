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
