// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { type IconProps } from "@expo/vector-icons/build/createIconSet";
import { type ComponentProps } from "react";

export function TabBarIcon({ style = {}, ...rest }) {
  if (rest.name.includes("camera-plus")) {
    return (
      <MaterialCommunityIcons
        size={28}
        style={[{ marginBottom: -3 }, style]}
        {...rest}
      />
    );
  } else if (rest.name.includes("user")) {
    return (
      <FontAwesome5 size={28} style={[{ marginBottom: -3 }, style]} {...rest} />
    );
  } else
    return (
      <Ionicons size={28} style={[{ marginBottom: -3 }, style]} {...rest} />
    );
}
