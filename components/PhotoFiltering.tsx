import SelectDropdown from "react-native-select-dropdown";
import { Collapsible } from "./Collapsible";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export function PhotoFilters({ setSortQuery, sortQuery }: any) {
  const sortingOptions = [
    { title: "Date (new to old)", sort_by: "created_at", order: "desc" },
    { title: "Date (old to new)", sort_by: "created_at", order: "asc" },
    {
      title: "Popularity (most liked first)",
      sort_by: "likes_count",
      order: "desc",
    },
    {
      title: "Popularity (least liked first)",
      sort_by: "likes_count",
      order: "asc",
    },
  ];

  return (
    <Collapsible title="Filters & Sorting..." extraStyle={styles.filtering}>
      <SelectDropdown
        data={sortingOptions}
        onSelect={({ sort_by, order }) => {
          setSortQuery({ sort_by, order });
        }}
        renderButton={(selectedItem, isOpened) => {
          return (
            <View style={styles.dropdownButtonStyle}>
              {selectedItem && (
                <Ionicons
                  name={selectedItem.icon}
                  style={styles.dropdownButtonIconStyle}
                />
              )}
              <Text style={styles.dropdownButtonTxtStyle}>
                {(selectedItem && selectedItem.title) || "Sort by..."}
              </Text>
              <Ionicons
                name={isOpened ? "chevron-up" : "chevron-down"}
                style={styles.dropdownButtonArrowStyle}
              />
            </View>
          );
        }}
        renderItem={(item, isSelected) => {
          return (
            <View
              style={{
                ...styles.dropdownItemStyle,
                ...(item.sort_by === sortQuery.sort_by &&
                  item.order === sortQuery.order && {
                    backgroundColor: "#D2D9DF",
                  }),
              }}
            >
              <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
        dropdownStyle={styles.dropdownMenuStyle}
      ></SelectDropdown>
    </Collapsible>
  );
}

const styles = StyleSheet.create({
  filtering: {
    position: "relative",
    borderColor: "grey",
    borderRadius: 20,
    borderStyle: "solid",
    borderWidth: 2,
    padding: 5,
    marginTop: 10,
    marginHorizontal: 10,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownButtonArrowStyle: {
    fontSize: 20,
  },
  dropdownButtonIconStyle: {
    fontSize: 20,
    marginRight: 8,
  },
  dropdownButtonStyle: {
    height: 50,
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
    marginTop: -30,
  },
});
