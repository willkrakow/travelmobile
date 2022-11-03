import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { LinearProgress, Text, Button, lightColors } from "@rneui/themed";
import useTripActivities from "../hooks/useTripActivities";
import dayjs from "dayjs";
import useFirebaseTrip from "../hooks/useFirebaseTrip";
import ThemeIcon from "./ThemeIcon";
import { isNil } from "../utils/common";
import { ActivityStackScreenProps } from "../types";
import ActivityCards from "./ActivityCards";
import useMergeDayActivities, { MergedActivitiesContext } from "../hooks/useMergeDayActivities";
import LodgingCard from "./LodgingCard";

export default function ActivityList({navigation}: ActivityStackScreenProps<"Home">) {
  const {tripDays, isLoading} = useMergeDayActivities();
  const [shouldRerender, setShouldRerender] = React.useState(false);

  const handleAddActivity = (tripDay: typeof tripDays[number]) => () => {
    navigation.navigate("AddActivity", {
      default_date: tripDay.day.toISOString(),
    })
  }
  return (
    <View style={styles.root}>
      {isLoading && <LinearProgress />}
      <MergedActivitiesContext.Provider
        value={{ shouldRerender, rerender: () => setShouldRerender(true) }}
      >
        <ScrollView>
          {tripDays.map((tripDay) => (
            <View key={tripDay.id} style={styles.dayWrapper}>
              <View style={styles.dayInner}>
                <Text style={styles.dayTitle}>
                  {tripDay.day.format("MMMM DD")}
                </Text>
                <Button
                  buttonStyle={styles.addButton}
                  type="clear"
                  icon={<ThemeIcon name="add" />}
                  onPress={handleAddActivity(tripDay)}
                />
              </View>
              {tripDay.lodgingInMorning[0] && (
                <LodgingCard lodging={tripDay.lodgingInMorning[0]} />
              )}
              <ActivityCards
                acts={tripDay.activities}
                nightLodging={tripDay.lodgingAtNight[0]}
                morningLodging={tripDay.lodgingInMorning[0]}
              />
              {tripDay.lodgingAtNight[0] && (
                <LodgingCard lodging={tripDay.lodgingAtNight[0]} />
              )}
            </View>
          ))}
        </ScrollView>
      </MergedActivitiesContext.Provider>
    </View>
  );
}


const styles = StyleSheet.create({
  root: {
    borderRadius: 20,
    shadowColor: lightColors.black,
    shadowOpacity: 0.1,
    shadowOffset: { height: 5, width: 0 },
    shadowRadius: 5,
    margin: 20,
    flex: 1,
  },
  dayWrapper: {
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomColor: lightColors.grey1,
    borderBottomWidth: 2,
  },
  dayInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  dayTitle: { color: lightColors.grey1, marginBottom: 10, fontWeight: "900" },
  addButton: { padding: 0 },
});
