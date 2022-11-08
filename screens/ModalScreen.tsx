import { Button, ListItem } from "@rneui/themed";
import React from "react";
import { StyleSheet } from "react-native";
import { View } from "../components/Themed";
import ThemeIcon from "../components/ThemeIcon";
import useFirebaseTrips from "../hooks/useFirebaseTrips";
import { useTripContext } from "../hooks/useTripContexts";
import { RootStackScreenProps } from "../types";

export default function ModalScreen({
  navigation,
}: RootStackScreenProps<"Modal">) {
  const { query } = useFirebaseTrips();
  const { tripId, changeTripId } = useTripContext();

  const handlePress = (id: string) => {
    changeTripId && changeTripId(id);
    // navigation.navigate("Root");
  };

  const { isLoading, data } = query;
  // React.useEffect(() => {
  //   if (!isLoading) {
  //     if (data && data.length === 0) {
  //       console.log("No data")
  //     }
  //   }
  // }, [isLoading, data]);
  return (
    <>
      {query?.data &&
        query?.data.length > 0 &&
        query.data.map((t) => (
          <View key={t.id}>
          <ListItem key={t.id}>
            <ListItem.Content>
              <ListItem.Title>{t.title}</ListItem.Title>
            </ListItem.Content>
            <ListItem.CheckBox
              checked={tripId === t.id}
              onPress={() => handlePress(t.id)}
            />
              <Button
                  type="outline"
                  color="primary"
                  onPress={() =>
                    {}
                  }
                  title="Edit"
                />
          </ListItem>
          </View>
        ))}
      <Button
        onPress={() => navigation.navigate("Root", {screen: "Profile", params: {screen: "CreateTrip"}})}
        type="solid"
        color="primary"
        icon={<ThemeIcon name="add" color="white" />}
        title="New trip"
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
