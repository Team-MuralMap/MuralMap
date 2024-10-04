import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";

export default function CommentsSection({ comments, commentAuthors }: any) {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }; 

  return (
    <ScrollView style={styles.container}>
      {comments === undefined || comments.length === 0 ? (
        <Text style={styles.noCommentsText}>No comments yet.</Text>
      ) : (
        comments.map((comment: any) => {
          const author = commentAuthors.find((author: any) => author.user.user_id === comment.user_id);
          return (
            <View key={comment.comment_id} style={styles.commentContainer}>
              {author !== undefined && (
                <View style={styles.authorContainer}>
                  <Image source={{ uri: author.user.avatar_url }} style={styles.avatar} />
                  <Text style={styles.username}>{author.user.username}</Text>
                </View>
              )}
              <Text style={styles.commentBody}>{comment.body}</Text>
              <Text style={styles.commentTime}>{formatDate(comment.created_at)}</Text>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  commentContainer: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
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
