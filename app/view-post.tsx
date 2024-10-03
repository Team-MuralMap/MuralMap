import Post from "@/components/Post";
import { useLocalSearchParams } from "expo-router";

export default function ViewPhoto() {
  const { post, author } = useLocalSearchParams<{ post: string; author: string }>();

  return <Post post={JSON.parse(post)} author={JSON.parse(author)} />;
}
