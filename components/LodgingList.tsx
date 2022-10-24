import React from "react";
import { Linking, StyleSheet, View } from "react-native";
import {
  LinearProgress,
  Button,
  lightColors,
  ListItem,
  Text,
} from "@rneui/themed";
import dayjs, { Dayjs } from "dayjs";
import useFirebaseTrip from "../hooks/useFirebaseTrip";
import ThemeIcon from "./ThemeIcon";
import useLodging from "../hooks/useLodging";
import { ILodging } from "../types/Lodging";
import { average } from "../utils/math";
import { placeDirectionsUrl } from "../utils/maps";
import DeleteLodgingDialog from "./DeleteLodgingDialog";
import { LodgingStackScreenProps } from "../types";

const isNil = (item?: unknown) => typeof item === "undefined" || item === null;

export default function LodgingList({ navigation }: LodgingStackScreenProps<"Home">) {
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);

  const [recordToDelete, setRecordToDelete] = React.useState<
    (ILodging & { id: string }) | undefined
  >();

  const { getAll: lodgingQuery } = useLodging();
  const { query: tripQuery } = useFirebaseTrip();
  const { data: lodgingData = [], isLoading: isLoadingLodging } = lodgingQuery;

  const { data: tripData } = tripQuery;

  const ordered = React.useMemo(() => {
    if (typeof lodgingData === "undefined" || lodgingData?.length === 0)
      return [];
    return lodgingData.sort((a, z) => {
      if (dayjs(a.start_date).isBefore(dayjs(z.start_date))) return -1;
      return 1;
    });
  }, [lodgingData]);

  const tripDays = React.useMemo(() => {
    if (isNil(tripData?.departure_date) || isNil(tripData?.return_date))
      return [];
    const startDate = dayjs(tripData?.departure_date);
    const endDate = dayjs(tripData?.return_date);

    const days: dayjs.Dayjs[] = [];
    let currentDay = startDate;
    while (currentDay.isBefore(endDate, "day")) {
      days.push(currentDay);
      currentDay = currentDay.add(1, "day");
    }

    console.log('days', days);
    console.log('ordered', ordered);

    const dayData = days.map((day) => {
      const lodging = ordered.find((stay) => {
        if(dayjs(stay.start_date).isAfter(day)) return false;
        
        return dayjs(stay.start_date).startOf("day").isBefore(day) && dayjs(stay.end_date).subtract(1, 'day').endOf("day").isAfter(day)
        
      });
      return {
        day,
        lodging,
      };
    });
    return dayData;
  }, [tripData, ordered]);

  console.log(tripDays)
  const handleGetDirections = async (placeId?: string) => {
    if (!placeId) return;
    const url = placeDirectionsUrl(placeId);
    const canOpenUrl = await Linking.canOpenURL(url);

    if (canOpenUrl) {
      await Linking.openURL(url);
    }
  };

  const handleCloseDelete = () => {
    setRecordToDelete(undefined);
    setIsDeleting(false);
  };

  const handleOpenDelete = (lodging?: ILodging & { id: string }) => {
    setRecordToDelete(lodging);
    setIsDeleting(true);
  };

  const handleOpenEdit = (lodging?: ILodging & {id: string}) => {
    navigation.navigate("AddLodging", {default_data: lodging});
  }

  const handleAddToDay = (day: Dayjs) => {
    navigation.navigate("AddLodging", {default_day: day})
  }

  return (
    <View style={styles.root}>
      {isLoadingLodging && <LinearProgress />}
      {tripDays.slice(1).map((tripDay) => (
        <View key={`${tripDay.lodging?.id}-${tripDay.day.toString()}`}>
          <Text style={styles.dayTitle}>{tripDay.day.format("MMMM DD")}</Text>
          <ListItem.Swipeable
            animation={{
              duration: 200,
              type: "spring",
            }}
            style={styles.dayWrapper}
            leftContent={(reset) => (
              <Button
                type="outline"
                color="primary"
                containerStyle={styles.swipeButtonLeft}
                buttonStyle={styles.swipeButton}
                icon={<ThemeIcon name="pencil" color="primary" />}
                onPress={() => {
                  reset();
                  handleOpenEdit(tripDay.lodging);
                }}
              />
            )}
            rightContent={(reset) => (
              <Button
                type="solid"
                color="warning"
                containerStyle={styles.swipeButtonRight}
                buttonStyle={styles.swipeButton}
                icon={<ThemeIcon name="trash" color="white" />}
                onPress={() => {
                  reset();
                  handleOpenDelete(tripDay.lodging);
                }}
              />
            )}
          >
            {tripDay?.lodging ? (
              <React.Fragment>
                <ListItem.Content>
                  <ListItem.Title>{tripDay?.lodging.title?.split(',')[0]}</ListItem.Title>
                  {tripDay.lodging.night_prices.length > 0 && (
                    <Text>
                      {tripDay.lodging.night_prices.length > 1 && "Avg. "}$
                      {average(tripDay.lodging.night_prices)} per night
                    </Text>
                  )}
                </ListItem.Content>
                <ListItem.Chevron
                  onPress={async () =>
                    await handleGetDirections(tripDay.lodging?.place_id)
                  }
                />
              </React.Fragment>
            ) : (
              <Button
                buttonStyle={{ padding: 0 }}
                type="clear"
                icon={<ThemeIcon name="add" />}
                onPress={() => handleAddToDay(tripDay.day)}
              />
            )}
          </ListItem.Swipeable>
        </View>
      ))}
      {typeof recordToDelete !== "undefined" && (
        <DeleteLodgingDialog
          isVisible={isDeleting}
          lodging={recordToDelete}
          onClose={handleCloseDelete}
        />
      )}
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
  },
  dayWrapper: {
    borderRadius: 10,
    shadowColor: lightColors.grey0,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 10,
    elevation: 10,
    backgroundColor: lightColors.white,
    padding: 5,
  },
  dayInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  dayTitle: {
    color: lightColors.grey1,
    marginBottom: 10,
    marginTop: 10,
    fontWeight: "900",
  },
  swipeButton: { height: 59, width: 59 },
  swipeButtonRight: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  swipeButtonLeft: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
