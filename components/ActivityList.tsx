import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { LinearProgress, Text, Button, lightColors } from "@rneui/themed";
import useTripActivities from "../hooks/useTripActivities";
import ActivityCard from "./ActivityCard";
import dayjs from "dayjs";
import useFirebaseTrip from "../hooks/useFirebaseTrip";
import { IActivity } from "../types/Activities";
import ThemeIcon from "./ThemeIcon";
import { isNil } from "../utils/common";
import { ActivityStackScreenProps } from "../types";


export default function ActivityList({navigation}: ActivityStackScreenProps<"Home">) {
  const { getAll: activitiesQuery } = useTripActivities();
  const { query: tripQuery } = useFirebaseTrip();
  const { data: activityData = [], isLoading: isLoadingActivities } =
    activitiesQuery;

  const { data: tripData } = tripQuery;


  const ordered = React.useMemo(() => {
    if (typeof activityData === "undefined" || activityData?.length === 0)
      return [];
    return activityData.sort((a, z) => {
      if (dayjs(a.start_date).isBefore(dayjs(z.start_date))) return -1;
      return 1;
    });
  }, [activityData]);

  const tripDays = React.useMemo(() => {
    if (isNil(tripData?.departure_date) || isNil(tripData?.return_date))
      return [];
    const startDate = dayjs(tripData?.departure_date);
    const endDate = dayjs(tripData?.return_date);

    const days = [];
    let currentDay = startDate;
    while (currentDay.isBefore(endDate, "day")) {
      days.push(currentDay);
      currentDay = currentDay.add(1, "day");
    }

    const dayData = days.map((day) => {
      const activities = ordered.filter((act) =>
        dayjs(act.start_date).isSame(day, "day")
      );
      return {
        day,
        activities,
      };
    });
    return dayData;
  }, [tripData, ordered]);

  return (
    <View style={styles.root}>
      {isLoadingActivities && <LinearProgress />}
      <ScrollView>
        {tripDays.map((tripDay) => (
          <View key={tripDay.day.toString()} style={styles.dayWrapper}>
            <View style={styles.dayInner}>
              <Text style={styles.dayTitle}>
                {tripDay.day.format("MMMM DD")}
              </Text>
              <Button
                buttonStyle={{ padding: 0 }}
                type="clear"
                icon={<ThemeIcon name="add" />}
                onPress={() =>
                  navigation.navigate("AddActivity", {
                    default_date: tripDay.day.toISOString(),
                  })
                }
              />
            </View>
            <ActivityCards acts={tripDay.activities} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const ActivityCards = ({ acts }: { acts: (IActivity & { id: string })[] }) => {
  return (
    <React.Fragment>
      {acts.map((a) => (
        <ActivityCard key={a.id} act={a} />
      ))}
    </React.Fragment>
  );
};

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
});
