import React from "react";
import { IActivity } from "../types/Activities";
import {
  Button,
  FAB,
  Input,
  lightColors,
  LinearProgress,
  Text,
  useTheme,
} from "@rneui/themed";
import { Modal, ScrollView, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useTripActivities from "../hooks/useTripActivities";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import DatePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import useFirebaseTrip from "../hooks/useFirebaseTrip";
import { GOOGLE_MAPS_API_KEY } from "../constants/Api";
import ThemeIcon from "./ThemeIcon";
import { useTripContext } from "../hooks/useTripContexts";
import useUserId from "../hooks/useUserId";
import { ActivityStackScreenProps } from "../types";
import MapsAutocomplete from "./MapsAutocomplete";
import { IPlacesPrediction } from "../types/Maps";

interface INewActivityForm {
  title: string;
  location: string;
  place_id: string;
  url: string;
  price: string;
  equipment: string[];
  start_date: dayjs.Dayjs;
  end_date: dayjs.Dayjs;
  notes: string;
}
const ActivityForm = ({navigation, route}: ActivityStackScreenProps<"AddActivity">) => {
  const defaultDate = dayjs(route.params?.default_date);
  const existingData = route.params?.default_data;
    const { tripId = "" } = useTripContext();
  const { create, update } = useTripActivities();
  const user_id = useUserId();

  const {
    query: { data: tripData },
  } = useFirebaseTrip();
  const [data, setData] = React.useState<INewActivityForm>({
    title: existingData?.title || "",
    location: existingData?.location || "",
    url: existingData?.url || "",
    price: existingData?.price?.toString() || "",
    equipment: [],
    place_id: existingData?.place_id || "",
    start_date: existingData?.start_date ? dayjs(existingData.start_date) : defaultDate,
    end_date: existingData?.end_date ? dayjs(existingData.end_date) : dayjs(),
    notes: existingData?.notes || "",
  });

  const [showLocationModal, setShowLocationModal] = React.useState(false);
  const { theme } = useTheme();

  const handleChange = (key: keyof INewActivityForm, text: string) => {
    setData({
      ...data,
      [key]: text,
    });
  };

  const handleSubmit = () => {
    const formatted: IActivity & { id?: string } = {
      ...existingData,
      ...data,
      user_id,
      price: parseInt(data.price, 10),
      equipment: ["asdf"],
      trip_id: tripId,
      start_date: data.start_date.toISOString(),
      end_date: data.end_date.toISOString(),
    };
    
    if(existingData?.id){

      update.mutate({...formatted, id: existingData.id}, {
        onSuccess: () => navigation.navigate("Home")
      })
    } else {
      create.mutate(formatted, {
        onSuccess: () => navigation.navigate("Home"),
      });
    }
  };

  const handlePlaceSelect = (item: IPlacesPrediction) =>{
    setData({
      ...data,
      location: item.description,
      place_id: item.place_id,
    });
    setShowLocationModal(false);
  }

  return (
    <View style={styles.root}>
      <ScrollView style={styles.scrollRoot}>
        <Input
          value={data.title}
          onChangeText={(text) => handleChange("title", text)}
          label="Title"
        />
        <Input
          leftIcon={
            <Ionicons
              name="location"
              color={
                data.place_id.length > 0
                  ? theme.colors.primary
                  : theme.colors.grey3
              }
              size={20}
            />
          }
          label="Location"
          value={data.location}
          onFocus={() => setShowLocationModal(true)}
          onPressIn={() => setShowLocationModal(true)}
        />
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 0.3 }}>
            <Text style={styles.timeLabel}>Start time</Text>
          </View>
          <View style={{ flex: 0.7 }}>
            <DatePicker
              mode="datetime"
              minimumDate={dayjs(tripData?.departure_date || "").toDate()}
              maximumDate={dayjs(tripData?.return_date || "").toDate()}
              value={data?.start_date?.toDate()}
              onChange={(_, date) =>
                setData({ ...data, start_date: dayjs(date) })
              }
            />
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 0.3 }}>
            <Text style={styles.timeLabel}>End time</Text>
          </View>
          <View style={{ flex: 0.7 }}>
            <DatePicker
              mode="datetime"
              value={data.end_date.toDate()}
              minimumDate={data.start_date?.toDate()}
              maximumDate={dayjs(tripData?.return_date).toDate()}
              onChange={(_, date) =>
                setData({ ...data, end_date: dayjs(date) })
              }
            />
          </View>
        </View>
        <Input
          keyboardType="number-pad"
          value={data.price}
          onChangeText={(text) => handleChange("price", text)}
          leftIcon={<ThemeIcon name="logo-usd" />}
          label="Price"
        />
        <Input
          value={data.notes}
          onChangeText={(text) => handleChange("notes", text)}
          label="Notes"
          leftIcon={<ThemeIcon name="information" />}
          multiline={true}
          numberOfLines={5}
        />
        <Button
          loading={create.isLoading}
          disabled={create.isLoading}
          onPress={handleSubmit}
          type="solid"
          color="primary"
        >
          {create.isLoading ? <LinearProgress /> : "Save"}
        </Button>
      </ScrollView>
      <Modal
        visible={showLocationModal}
        onDismiss={() => setShowLocationModal(false)}
        animationType="slide"
        presentationStyle="formSheet"
        style={styles.placesModal}
      >
        <MapsAutocomplete onSelect={handlePlaceSelect} />
        <FAB
          onPress={() => setShowLocationModal(false)}
          icon={<ThemeIcon name="close" color="white" />}
          placement="right"
          containerStyle={{ zIndex: 200, elevation: 20 }}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, padding: 10 },
  scrollRoot: {},
  placesModal: {
    paddingTop: 20,
    marginTop: 20,
  },
  placesInput: {
    paddingTop: 5,
    borderWidth: 2,
    borderColor: lightColors.primary,
    borderRadius: 10,
    padding: 5,
    margin: 5,
    elevation: 15,
  },
  timeLabel: {
    fontWeight: "bold",
    color: lightColors.grey3,
    fontSize: 16,
    lineHeight: 40,
    marginLeft: 10,
    marginBottom: 10,
  },
  timeContainer: {
    flexBasis: "100%",
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
    alignContent: "center",
  },
  timeWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginRight: 0,
    paddingBottom: 20,
    justifyContent: "flex-start",
    flex: 1,
  },
  datePicker: {
    flex: 1,
  },
});
export default ActivityForm;
