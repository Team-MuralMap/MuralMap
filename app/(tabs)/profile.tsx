import React from 'react';
import { Text, View, StyleSheet } from "react-native";
import UserCard from "../user-card";
import UserPhotos from "../user-photos";

export default function Profile() {
  return (
    <View style={styles.container}>
      <View style={styles.spacer}></View>
      <UserCard />
      <UserPhotos />
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