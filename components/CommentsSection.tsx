import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CommentsSection({ comments }: any) {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <View style={styles.container}>
      {comments === undefined || comments.length === 0 ? (
        <Text style={styles.noCommentsText}>No comments yet.</Text>
      ) : (
        comments.map((comment: any) => (
          <View key={comment.comment_id} style={styles.commentContainer}>
            <Text style={styles.commentBody}>{comment.body}</Text>
            <Text style={styles.commentTime}>
              {formatDate(comment.created_at)}
            </Text>
          </View>
        ))
      )}
    </View>
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
