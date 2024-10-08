import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { fetchPosts, fetchUsers, fetchSiteBySiteId } from "../../client/client.mjs";
import Post from "@/components/Post";

async function getCityByCoordinates(latitude: number, longitude: number): Promise<string> {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.address) {
      const city = data.address.city || data.address.town || data.address.village || "";
      return city;
    } else {
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

  useEffect(() => {
    const fetchData = async () => {
      setIsPostsLoading(true);
      setIsUsersLoading(true);

      const [{ posts }, { users }] = await Promise.all([
        fetchPosts(),
        fetchUsers(),
      ]);

      const sortedPosts = posts.sort((a: Post, b: Post) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setPosts(sortedPosts);
      setUsers(users);
      setIsPostsLoading(false);
      setIsUsersLoading(false);

      sortedPosts.forEach(async (post: { site_id: string; post_id: any }) => {
        const city = await fetchCityForSite(post.site_id);
        setCities((prevCities) => ({ ...prevCities, [post.post_id]: city }));
      });
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      {isPostsLoading || isUsersLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#DD614A" />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.flatListContent}
          data={posts}
          keyExtractor={(item) => item.post_id.toString()}
          renderItem={({ item }) => {
            const author = users.find((user: any) => user.user_id === item.user_id);
            const city = cities[item.post_id];

            return (
              <View style={styles.postContainer}>
                <Post 
                  post={item} 
                  author={author} 
                  city={city} 
                />
              </View>
            );
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
    margin: 0,
    padding: 0,
  },
  flatListContent: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 0,
    paddingTop: 50,
  },
  postContainer: {
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
    paddingTop: 50,
  },
  usernameText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  cityText: { // Add a new style for the city text
    fontSize: 14,
    color: "#DD614A", // Set the city color
  },
  postTime: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
    textAlign: "right",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
