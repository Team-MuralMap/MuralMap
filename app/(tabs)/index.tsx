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

export default function Index() {
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

  const [sites, setSites] = useState([]);
  const [isSitesLoading, setIsSitesLoading] = useState(true);

  useEffect(() => {
    setIsSitesLoading(true);
    fetchSites().then(({ sites }) => {
      setSites(sites);
      setIsSitesLoading(false);
    });
  });

  const [previewedSite, setPreviewedSite] = useState<null | number>(null);

  function getSitePreviewURL(site_id: number) {
    site_id;
    return "https://archive.nuartfestival.no/img/a_102_13020_713.jpg";
  }

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
          {sites.map(({ latitude, longitude, site_id }) => (
            <Marker key={site_id} coordinate={{ latitude, longitude }}>
              <Callout
                onPress={() => console.log(`You just pressed site ${site_id}!`)}
              >
                <Text>
                  <Image
                    src={getSitePreviewURL(site_id)}
                    style={styles.sitePreviewImg}
                  />
                </Text>
              </Callout>
            </Marker>
          ))}
        </MapView>
        {previewedSite ? <Text>{previewedSite}</Text> : null}
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
    borderColor: "#990000",
    borderWidth: 20,
    borderStyle: "solid",
    paddingTop: 10,
    backgroundColor: "#00ff00",
  },
});
