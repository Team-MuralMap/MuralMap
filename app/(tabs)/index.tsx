import { Text, View } from "react-native";
import MapView from "react-native-maps";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>This is android</Text>
      <MapView
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </View>
  );
}
