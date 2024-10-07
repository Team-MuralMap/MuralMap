import { useState, useCallback } from "react";
import { Text, View, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  fetchPosts,
  fetchUsers,
  fetchSiteBySiteId,
} from "../../client/client.mjs";
import Post from "@/components/Post";

async function getCityByCoordinates(
  latitude: number,
  longitude: number
): Promise<string> {
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

async function fetchCityForSite(site_id: string) {
  const { site } = await fetchSiteBySiteId(site_id);
  const city = await getCityByCoordinates(site.latitude, site.longitude);
  return city;
}

export default function Photos() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isPostsLoading, setIsPostsLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [cities, setCities] = useState<{ [postId: string]: string }>({});

  const fetchData = async () => {
    setIsPostsLoading(true);
    setIsUsersLoading(true);

    try {
      const [{ posts }, { users }] = await Promise.all([
        fetchPosts(),
        fetchUsers(),
      ]);

      setPosts(posts);
      setUsers(users);
      setIsPostsLoading(false);
      setIsUsersLoading(false);

      const citiesMap: { [postId: string]: string } = {};

      for (const post of posts) {
        const city = await fetchCityForSite(post.site_id);
        citiesMap[post.post_id] = city;
      }

      setCities(citiesMap);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // this makes sure it refreshes when we return to it (e.g. after post creation/deletion)
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <ScrollView>
      {isPostsLoading || isUsersLoading ? (
        <Text>Loading...</Text>
      ) : (
        <View>
          {posts.map((item) => {
            const author = users.find(
              (user: any) => user.user_id === item.user_id
            );
            const city = cities[item.post_id];
            return <Post post={item} author={author} city={city} />;
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  flatListContent: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  postContainer: {
    backgroundColor: "#fff", 
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3, // Android shadow
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
});
