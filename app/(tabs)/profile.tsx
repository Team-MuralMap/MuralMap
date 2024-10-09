import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import UserCard from "../user-card";
import UserPhotos from "../user-photos";
import { useLocalSearchParams } from "expo-router";
import { UserContext } from "@/contexts/UserContext";

export default function Profile() {
  let { user_id } = useLocalSearchParams();
  const { loggedInUser } = useContext(UserContext);

  if(!user_id) {
    user_id = loggedInUser.user_id;
  }

  return (
    <View style={styles.container}>
      <View style={styles.spacer}></View>
      <UserCard user_id={user_id || loggedInUser.user_id} />
      <UserPhotos user_id={user_id || loggedInUser.user_id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  spacer: {
    height: 80,
  },
});
