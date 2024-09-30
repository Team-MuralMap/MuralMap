import { Platform, Text, View } from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { useEffect, useState } from "react";

export default function Index() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(location);
    })();
  }, []);

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
          showsUserLocation={true}
          onPress={(e) => {
            Location.getCurrentPositionAsync({}).then((location) => {
              setLocation(location);
              console.log("Current location:", location);
            });
          }}
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
