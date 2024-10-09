import React from "react";
import { View, StyleSheet } from "react-native";
import UserCard from "../user-card";
import UserPhotos from "../user-photos";
import { useLocalSearchParams } from "expo-router";

export default function Profile() {
  const { user_id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <View style={styles.spacer}></View>
      <UserCard user_id={user_id} />
      <UserPhotos user_id={user_id} />
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
