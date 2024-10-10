import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function CommentsSection({ comments, commentAuthors }: any) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState<number>(Number(comments.likes_count));
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const router = useRouter();

  const handleLikePress = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  return (
    <View style={styles.container}>
      {comments === undefined || comments.length === 0 ? (
        <Text style={styles.noCommentsText}>No comments yet.</Text>
      ) : (
        comments.map((comment: any) => {
          const author = commentAuthors.find(
            (author: any) => author.user.user_id === comment.user_id
          );
          return (
            <View key={comment.comment_id} style={styles.commentContainer}>
              {author !== undefined && (
                <TouchableOpacity
                  onPress={() => {
                    router.push(`/profile?user_id=${comment.user_id}`);
                  }}
                >
                  <View style={styles.authorContainer}>
                    <Image
                      source={{ uri: author.user.avatar_url }}
                      style={styles.avatar}
                    />
                    <Text style={styles.username}>{author.user.username}</Text>
                  </View>
                </TouchableOpacity>
              )}
              <Text style={styles.commentBody}>{comment.body}</Text>

              <View style={styles.likesContainer}>
                <Text style={styles.likesCount}>
                  {comment.likes_count}{" "}
                  {comment.likes_count.toString() === "1" ? "like" : "likes"}
                </Text>
                <TouchableOpacity
                  onPress={handleLikePress}
                  style={styles.likeButton}
                >
                  <Text style={styles.likeButtonText}>
                    {liked ? "Liked" : "Like"}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.commentTime}>
                {formatDate(comment.created_at)}
              </Text>
            </View>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 10,
  },
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  likesCount: {
    fontSize: 12,
    color: "#DD614A",
    marginRight: 2,
  },
  likeButton: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: "#DD614A",
  },
  likeButtonText: {
    fontSize: 12,
    color: "white",
  },
  commentContainer: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
    paddingTop: 20,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  commentBody: {
    fontSize: 16,
    color: "#333",
  },
  commentTime: {
    fontSize: 12,
    color: "#888",
  },
  noCommentsText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
});
