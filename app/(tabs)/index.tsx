import { Platform, Text, View } from "react-native";
import MapView from "react-native-maps";

export default function Index() {
  if (Platform.OS === "android" || Platform.OS === "ios") {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <MapView
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </View>
    );
  } else {
    return (
      <View style={{ flex: 1, paddingTop: 22 }}>
        <Text>This is the map</Text>
      </View>
    );
  }
}
