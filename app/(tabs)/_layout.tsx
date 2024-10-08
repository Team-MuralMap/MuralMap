import { router, Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Image, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerStyle: {
          backgroundColor: "#DD614A",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerLeft: () => (
          <View>
            <TouchableOpacity
              onPress={() => {
                router.push("/");
              }}
            >
              <Image
                style={{
                  height: 28,
                  width: 28,
                  marginLeft: 20,
                }}
                source={require("../../assets/images/icon.png")}
              />
            </TouchableOpacity>
          </View>
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <Ionicons
              size={28}
              style={{ color: "white", marginHorizontal: 20 }}
              name="arrow-back-circle"
            />
          </TouchableOpacity>
        ),
      }}
      backBehavior="history"
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Map",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "earth" : "earth-outline"}
              color={color}
            />
          ),
          headerRight: () => <></>,
          headerTitle: "Home",
        }}
      />

      <Tabs.Screen
        name="photos"
        options={{
          title: "Photos",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "images" : "images-outline"}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="create-post"
        options={{
          title: "New Post",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "camera-plus" : "camera-plus-outline"}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "search" : "search"} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? "user-alt" : "user"} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="publish-post"
        options={{ href: null, title: "New Post" }}
      />
      <Tabs.Screen
        name="post/[post_id]"
        options={{ href: null, title: "View post" }}
      />
    </Tabs>
  );
}
