import { Text, View } from "react-native";
import UserCard from "../user-card";
import UserPhotos from "../user-photos";

export default function Profile() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      
    
      <UserCard/>
      <View style={{ flex: 1 }}></View>
      <UserPhotos/>
    </View>
  );
}
