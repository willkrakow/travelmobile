import React from "react";
import {
  Button,
  FAB,
  Input,
  lightColors,
  LinearProgress,
  Text,
  useTheme,
} from "@rneui/themed";
import { Modal, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import DatePicker from "@react-native-community/datetimepicker";
import dayjs, { Dayjs } from "dayjs";
import useFirebaseTrip from "../hooks/useFirebaseTrip";
import { GOOGLE_MAPS_API_KEY } from "../constants/Api";
import ThemeIcon from "./ThemeIcon";
import { useTripContext } from "../hooks/useTripContexts";
import useLodging from "../hooks/useLodging";
import { ILodging } from "../types/Lodging";
import { isNil, mapToString } from "../utils/common";
import useUserId from "../hooks/useUserId";
import { LodgingStackScreenProps } from "../types";

interface ILodgingForm {
  onSuccess: () => void;
  defaultDay: Dayjs;
  defaultData?: ILodging & {id: string};
  action?: "create" | "update"
}

interface INewLodging {
  title: string;
  location: string;
  place_id: string;
  url: string;
  night_prices: string[];
  start_date: dayjs.Dayjs;
  end_date: dayjs.Dayjs;
  booking_reference: string;
}

const setTime = (date?: Dayjs, hour: number = 12, minute: number = 0) => {
  if(!date) return dayjs();
  return date?.set("hour", hour).set("minute", minute)
}

const checkInTime = (date?: Dayjs) => setTime(date, 16);
const checkOutTime = (date?: Dayjs) => setTime(date, 11);

const LodgingForm = ({ navigation, route }: LodgingStackScreenProps<"AddLodging">) => {
  const { params: {default_data, default_day} } = route;
  const { tripId = "" } = useTripContext();
  const actions = useLodging();
  const user_id = useUserId();
  const {
    query: { data: tripData, isLoading: isLoadingTrip },
  } = useFirebaseTrip();
  const {
    getAll: { data: lodgingData = [], isLoading: isLoadingLodging },
  } = useLodging();
  const lastBookedDay = React.useMemo(() => {
    if(default_day) return default_day;
    if(isLoadingLodging || isLoadingTrip) return dayjs()
    if (lodgingData.length === 0) {
      return dayjs(tripData?.departure_date || "");
    }
    const sorted = lodgingData.sort((a, b) => {
      const aDate = dayjs(a.end_date);
      const bDate = dayjs(b.end_date);

      if (aDate.isBefore(bDate)) return -1;

      return 1;
    });

    return dayjs(sorted[0]?.end_date);
  }, [lodgingData]);

  const [data, setData] = React.useState<INewLodging>({
    title: "",
    location: "",
    url: "",
    night_prices: [],
    place_id: "",
    start_date: checkInTime(default_day),
    end_date: checkOutTime(default_day?.add(1, 'day')),
    booking_reference: '',
  });

  const [showLocationModal, setShowLocationModal] = React.useState(false);
  const { theme } = useTheme();

  const handleChange = (key: keyof INewLodging, text: string) => {
    setData({
      ...data,
      [key]: text,
    });
  };

  const formAction = React.useMemo(() => {
    if (default_data) return actions.update;

    return actions.create;
  }, []);

  const handleSubmit = () => {
    const formatted: ILodging = {
      ...data,
      user_id,
      booking_reference: data.booking_reference,
      night_prices: data.night_prices.map(d => parseInt(d, 10)),
      trip_id: tripId,
      start_date: data.start_date.toISOString(),
      end_date: data.end_date.toISOString(),
    };

    // @ts-ignore
    formAction.mutate(formatted, {
      onSuccess: navigation.navigate("Home"),
    });
  };

  

  React.useEffect(() => {
    if(!isNil(default_data)){
      setData({
        booking_reference: default_data?.booking_reference || '',
        end_date: dayjs(default_data?.end_date || ''),
        start_date: dayjs(default_data?.start_date || ''),
        location: default_data?.location || '',
        night_prices: mapToString(default_data?.night_prices || []),
        place_id: default_data?.place_id || '',
        title: default_data?.title || '',
        url: ''
      })
    }
  }, [default_data])
  return (
    <View style={styles.root}>
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
        label="Hotel"
        value={data.location}
        onFocus={() => setShowLocationModal(true)}
        onPressIn={() => setShowLocationModal(true)}
      />
      <View style={styles.timeWrapper}>
        <View style={styles.timeContainer}>
          <Text style={styles.timeLabel}>Start time</Text>
          <DatePicker
            mode="datetime"
            style={styles.datePicker}
            value={data.start_date.toDate()}
            onChange={(_, date) =>
              setData({ ...data, start_date: dayjs(date) })
            }
          />
        </View>
        <View style={styles.timeContainer}>
          <Text style={styles.timeLabel}>End time</Text>
          <DatePicker
            mode="datetime"
            style={styles.datePicker}
            value={data.end_date.toDate()}
            onChange={(_, date) => setData({ ...data, end_date: dayjs(date) })}
          />
        </View>
      </View>
      <Input
        value={data.url}
        onChangeText={(text) => handleChange("url", text)}
        label="Link"
        leftIcon={<ThemeIcon name="link" />}
        autoCapitalize="none"
      />
      <Input
        value={data.booking_reference}
        onChangeText={(text) => handleChange("booking_reference", text)}
        label="Booking Reference"
        leftIcon={<ThemeIcon name="information" />}
        multiline={true}
        numberOfLines={3}
      />
      <Button
        loading={formAction.isLoading}
        disabled={formAction.isLoading}
        onPress={handleSubmit}
      >
        {formAction.isLoading ? <LinearProgress /> : "Save"}
      </Button>
      <Modal
        visible={showLocationModal}
        onDismiss={() => setShowLocationModal(false)}
        style={{marginTop: showLocationModal ? 40 : 0,}}
        presentationStyle="formSheet"
      >
        <View style={{ marginTop: showLocationModal ? 20 : 0, flex: 1 }}>
          <FAB
            onPress={() => setShowLocationModal(false)}
            icon={<ThemeIcon name="close" />}
            placement="right"
          />
          <GooglePlacesAutocomplete
            placeholder="Search"
            textInputProps={{
              defaultValue: data.location,
            }}
            styles={{
              textInput: styles.placesInput,
            }}
            onPress={(locationData) => {
              setData({
                ...data,
                title: locationData.description,
                location: locationData.description,
                place_id: locationData.place_id,
              });
              setShowLocationModal(false);
            }}
            query={{
              key: GOOGLE_MAPS_API_KEY,
              language: "en",
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, minHeight: 500 },
  placesModal: { marginTop: 20, paddingTop: 40, zIndex: 90 },
  placesInput: {
    borderWidth: 2,
    borderColor: lightColors.primary,
    borderRadius: 10,
    padding: 5,
    margin: 5,
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
    justifyContent: "flex-start",
    flex: 1,
  },
  datePicker: {
    flex: 1,
  },
});
export default LodgingForm;
