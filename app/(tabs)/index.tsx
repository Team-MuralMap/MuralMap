import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { fetchSites } from "@/client/client.mjs";
import WebView from "react-native-webview";

export default function Index() {
  const defaultSitePreview =
    "https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/0f7bfb63-2a9d-4b1e-bdf6-08be9a3482fd/width=450/view-129-gigapixel-art-scale-2_00x.jpeg";

  const [location, setLocation] = useState<null | Location.LocationObject>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<null | string>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const [sites, setSites] = useState<
    Array<{
      latitude: number;
      longitude: number;
      site_id: number;
      site_preview_url: null | string;
      post_id: number;
    }>
  >([]);
  const [isSitesLoading, setIsSitesLoading] = useState(true);

  useEffect(() => {
    setIsSitesLoading(true);
    fetchSites().then(({ sites }) => {
      setSites(sites);
      setIsSitesLoading(false);
    });
  });

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
          style={styles.map}
        >
          {sites.map(({ latitude, longitude, site_id, site_preview_url }) =>
            site_preview_url ? (
              <Marker key={site_id} coordinate={{ latitude, longitude }}>
                <Callout
                  onPress={() =>
                    console.log(`You just pressed site ${site_id}!`)
                  }
                >
                  <WebView
                    source={{ uri: site_preview_url || defaultSitePreview }}
                    style={styles.sitePreviewImg}
                  />
                </Callout>
              </Marker>
            ) : (
              <Marker
                pinColor={"blue"}
                coordinate={{ latitude, longitude }}
                key={site_id}
              ></Marker>
            )
          )}
        </MapView>
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

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
  sitePreviewImg: {
    width: screenWidth / 3,
    height: screenWidth / 3,
  },
});
