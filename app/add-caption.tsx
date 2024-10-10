import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";

export default function AddComment() {
  const [comment, setComment] = useState<string>("");
  const router = useRouter();

  const handleCommentSubmission = () => {
    if (comment) {
      // Handle saving the comment
      router.back(); // Return to the previous screen.
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Add your comment..."
        value={comment}
        onChangeText={setComment}
        multiline
      />
      <TouchableOpacity
        style={[styles.button, comment ? styles.activeButton : styles.disabledButton]}
        onPress={handleCommentSubmission}
        disabled={!comment}
      >
        <Text style={styles.buttonText}>Add Comment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,

    alignItems: "center",
    paddingHorizontal: 20,
  },
  input: {
    width: "100%",
    height: 150,
    padding: 15,
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderColor: "#DD614A",
    borderWidth: 2,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#DD614A",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  activeButton: {
    backgroundColor: "#DD614A",
  },
  disabledButton: {
    backgroundColor: "#bbb",
  },
});