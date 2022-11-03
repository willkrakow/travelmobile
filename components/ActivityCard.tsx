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
import { useNavigation } from "@react-navigation/native";
import ThemeIcon from "./ThemeIcon";

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
  const navigate = useNavigation();
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

  const handleEdit = () => {
    navigate.navigate("Root", {
      screen: "Activities",
      params: { screen: "AddActivity", params: { default_data: act } },
    });
  };

  const width = Dimensions.get("screen").width - 20;
  return (
    <ListItem
      containerStyle={[
        styles.roundedBorder,
        styles.noPadding,
        { width: width - 20, zIndex: 20, elevation: 20 },
      ]}
      style={[styles.roundedBorder, styles.noPadding, styles.root]}
      bottomDivider
      disabled={deleteOne.isLoading}
      disabledStyle={{ backgroundColor: theme.colors.grey4 }}
    >
      <ListItem.Content style={{ position: "relative" }}>
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
        <View
          style={{
            position: "absolute",
            top: 10,
            right: 0,
            flexDirection: "row",
            justifyContent: "flex-end",
            flex: 1,
          }}
        >
          <Button
            containerStyle={{ marginRight: 5 }}
            type="solid"
            color="primary"
            onPress={handleEdit}
            icon={<ThemeIcon name="pencil" color="white" />}
          />
          <Button
            type="solid"
            color="warning"
            onPress={() => setIsDeleting(true)}
            icon={<ThemeIcon name="close" />}
          />
        </View>
        <View style={styles.cardInner}>
          <ListItem.Title style={styles.title}>{act.title}</ListItem.Title>
          <ListItem.Subtitle style={styles.subtitle} lineBreakMode="clip">
            <Ionicons name="location" />{" "}
            <PlaceLink
              placeId={act.place_id}
              displayName={`${act.location.split(",")[0]},${
                act.location.split(",")[1]
              }`}
            />
          </ListItem.Subtitle>
          <Text style={styles.dateRange}>
            <Ionicons name="time" /> {dayjs(act.start_date).format("h:mm A")} -{" "}
            {dayjs(act.end_date).format("h:mm A")}
          </Text>
        </View>
      </ListItem.Content>
      <Dialog
        isVisible={isDeleting}
        onDismiss={() => setIsDeleting(false)}
        animationType="slide"
        onBackdropPress={() => setIsDeleting(false)}
      >
        <Dialog.Title
          title={`Are you sure you want to delete ${act.title} from your trip?`}
        />
        <Dialog.Actions>
          <Dialog.Button
            loading={deleteOne.isLoading}
            disabled={deleteOne.isLoading}
            containerStyle={{ marginRight: 10 }}
            type="outline"
            color="primary"
            onPress={() => setIsDeleting(false)}
          >
            Cancel
          </Dialog.Button>
          <Dialog.Button
            loading={deleteOne.isLoading}
            disabled={deleteOne.isLoading}
            containerStyle={{ marginLeft: 10 }}
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
    zIndex: 21
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
    justifyContent: 'space-between',
    alignContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: Dimensions.get("screen").width - 60
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
    marginLeft: 10,
    marginRight: 0,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
    paddingBottom: 8,
  },
});

export default ActivityCard;
