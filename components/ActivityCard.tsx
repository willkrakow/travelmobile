import React from "react";
import { IActivity } from "../types/Activities";
import { Button, Text, Dialog, lightColors, useTheme } from "@rneui/themed";
import { ListItem } from "@rneui/themed";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import PlaceLink from "./PlaceLink";
import usePlaceDetails from "../hooks/usePlaceDetails";
import useTripActivities from "../hooks/useTripActivities";
import { placePhoto } from "../utils/images";

interface IActivityCard {
  act: IActivity & {
    id: string;
  };
}

const ActivityCard = ({ act }: IActivityCard) => {
  const { theme } = useTheme();
  const { data, isLoading } = usePlaceDetails(act?.place_id);
  const { deleteOne } = useTripActivities();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const photoRef = React.useMemo(() => {
    if (isLoading) return null;
    const r = data?.result?.photos?.[0]?.photo_reference || null;
    return r;
  }, [data, isLoading]);

  const handleDelete = async () => {
    deleteOne.mutate(act.id, {
      onSuccess: () => setIsDeleting(false),
    });
  };

  const width = Dimensions.get("screen").width - 20;
  return (
    <ListItem
      containerStyle={[
        styles.roundedBorder,
        styles.noPadding,
        { width: width - 20 },
      ]}
      style={[styles.roundedBorder, styles.noPadding, styles.root]}
      key={act.id}
      bottomDivider
      disabled={deleteOne.isLoading}
      disabledStyle={{ backgroundColor: theme.colors.grey4 }}
    >
      <ListItem.Content>
        {photoRef && (
          <View
            style={{
              overflow: "hidden",
              flex: 1,
              borderRadius: 20,
            }}
          >
            <Image
              style={[
                styles.roundedBorder,
                {
                  shadowColor: "black",
                  shadowOpacity: 0.25,
                  shadowRadius: 5,
                  shadowOffset: { height: 5, width: 0 },
                },
              ]}
              source={{
                uri: placePhoto(photoRef),
                width: width - 20,
                height: 290,
              }}
            />
          </View>
        )}
        <View style={styles.cardInner}>
          <ListItem.Title style={styles.title}>{act.title}</ListItem.Title>
          <ListItem.Subtitle style={styles.subtitle} lineBreakMode="clip">
            <Ionicons name="location" />{" "}
            <PlaceLink placeId={act.place_id} displayName={act.location} />
          </ListItem.Subtitle>
          <View style={styles.row}>
            <Text style={styles.dateRange}>
              <Ionicons name="time" /> {dayjs(act.start_date).format("h:mm A")}{" "}
              - {dayjs(act.end_date).format("h:mm A")}
            </Text>
            <Button
              buttonStyle={styles.deleteButton}
              type="clear"
              onPress={handleDelete}
              icon={
                <Ionicons style={styles.roundedBorder} name="close" size={20} />
              }
            />
          </View>
        </View>
      </ListItem.Content>
      <Dialog
        isVisible={isDeleting}
        onDismiss={() => setIsDeleting(false)}
        animationType="slide"
        onBackdropPress={() => setIsDeleting(false)}
      >
        <Dialog.Actions>
          <Dialog.Button
            loading={deleteOne.isLoading}
            disabled={deleteOne.isLoading}
            type="outline"
            color="primary"
            onPress={() => setIsDeleting(false)}
          >
            Cancel
          </Dialog.Button>
          <Dialog.Button
            loading={deleteOne.isLoading}
            disabled={deleteOne.isLoading}
            type="solid"
            color="primary"
            onPress={handleDelete}
          >
            Delete
          </Dialog.Button>
        </Dialog.Actions>
      </Dialog>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  root: {
    marginBottom: 10,
    marginLeft: "auto",
    marginRight: "auto",
  },
  title: {
    flex: 1,
    color: lightColors.secondary,
    marginBottom: 5,
  },
  subtitle: {
    flex: 1,
    flexBasis: "100%",
    color: lightColors.grey3,
    marginBottom: 10,
  },
  image: {
    flex: 1,
    margin: "auto",
    marginRight: -10,
    width: Dimensions.get("screen").width - 20,
  },
  cardInner: { padding: 10, flex: 1 },
  contained: { overflow: "hidden" },
  row: {
    flexDirection: "row",
  },
  flexOne: {
    flex: 1,
  },
  noPadding: {
    padding: 0,
  },
  dateRange: {
    flex: 0.85,
  },
  roundedBorder: {
    borderRadius: 20,
  },
  deleteButton: {
    padding: 5,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 30,
    backgroundColor: lightColors.grey5,
  },
});

export default ActivityCard;
