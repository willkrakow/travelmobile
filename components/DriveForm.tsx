import React from "react";
import useVehicles from "../hooks/useVehicles";
import useTripActivities from "../hooks/useTripActivities";
import useLodging from "../hooks/useLodging";
import dayjs, { Dayjs } from "dayjs";
import { StyleSheet, View } from "react-native";
import { Button, Input } from "@rneui/themed";
import SearchModal, { IOption } from "./SearchModal";
import useDrives from "../hooks/useDrives";
import useUserId from "../hooks/useUserId";
import { useTripContext } from "../hooks/useTripContexts";
import { useNavigation } from "@react-navigation/native";
import { IDrive } from "../types/Drives";

interface INewDriveForm {
  departure_location_name?: string;
  departure_location_id?: string;
  departure_location_type?: "lodging" | "activity";
  arrival_location_name?: string;
  arrival_location_id?: string;
  arrival_location_type?: "lodging" | "activity";
  departure_date?: Dayjs;
  arrival_date?: Dayjs;
  vehicle_name?: string;
  vehicle_id?: string;
}

const DriveForm = () => {
  const { getAll: vehicles } = useVehicles();
  const { getAll: activities } = useTripActivities();
  const { tripId: trip_id } = useTripContext();
  const { getAll: lodging } = useLodging();
  const {navigate} = useNavigation();
  const { create } = useDrives();
  const user_id = useUserId();

  const [openModal, setOpenModal] = React.useState<
    "departure" | "arrival" | "vehicles" | null
  >(null);
  const [data, setData] = React.useState<INewDriveForm>();

  const allPossibleLocations: IOption[] = React.useMemo(() => {
    const _activities = (activities.data || []).map((a) => ({
      ...a,
      type: "activity",
    }));
    const _lodging = (lodging.data || []).map((l) => ({
      ...l,
      type: "lodging",
    }));

    return [..._activities, ..._lodging].map((place) => ({
      ...place,
      value: place.location,
      type: place.type,
    }));
  }, [activities.data, lodging.data]);

  const handleSelectDeparture = (id: string, title: string, departure?: any) => {
    if (id && title) {
      setData({
        ...data,
        departure_location_id: id,
        departure_location_name: departure.title,
        departure_location_type: departure.type,
      });
    }
  };

  const handleSelectArrival = (id: string, title: string, arrival?: IOption) => {
    if (id && title) {
      setData({
        ...data,
        arrival_location_id: id,
        arrival_location_name: arrival?.title,
        arrival_location_type: arrival?.type,
      });
    }
  };

  const closeModal = React.useCallback(() => {
    setOpenModal(null);
  }, []);

  const handleSelectVehicle = (id: string, value: string, vehicle: IOption | undefined) => {
    setData({
      ...data,
      vehicle_id: vehicle?.id,
      vehicle_name: vehicle?.title,
    });
  };

  const handleCancel = () => {
    navigate("Root", { screen: "Transport", params: { screen: "Home" } });
  }

  const handleSave = () => {
    if(!data?.arrival_location_id) return;
    if(!data.arrival_location_type) return;
    if(!data.departure_location_id) return;
    if(!data.departure_location_type) return;

    const formatted: IDrive = {
      departure_location_id: data?.departure_location_id,
      departure_location_type: data?.departure_location_type,
      arrival_location_id: data?.arrival_location_id,
      arrival_location_type: data?.arrival_location_type,
      arrival_date: data?.arrival_date?.toISOString() || dayjs().toISOString(),
      departure_date:
        data?.departure_date?.toISOString() || dayjs().toISOString(),
      trip_id: trip_id || "",
      user_id,
      vehicle_id: data?.vehicle_id || "",
    };

    create.mutate(formatted, {
      onSuccess: () => {
        navigate("Root", {screen: "Transport", params: {screen: "Home"}})
      }
    })
  }
  return (
    <View style={styles.root}>
      <Input
        value={data?.departure_location_name || ""}
        onPressIn={() => setOpenModal("departure")}
        label="From"
      />
      <Input
        value={data?.arrival_location_name || ""}
        onPressIn={() => setOpenModal("arrival")}
        label="To"
      />
      <Input
        value={data?.vehicle_name || ""}
        onPressIn={() => setOpenModal("vehicles")}
        label="Vehicle"
      />
      <View style={{flexDirection: "row", flex: 1, justifyContent: 'space-between'}}>
      <Button onPress={handleSave} title="Save" color="primary" type="solid" />
      <Button onPress={handleCancel} title="Cancel" color="primary" type="outline" />

      </View>
      <SearchModal
        options={allPossibleLocations}
        label="Search places"
        onClose={closeModal}
        onSelect={handleSelectDeparture}
        visible={openModal === "departure"}
      />
      <SearchModal
        options={allPossibleLocations}
        label="Search places"
        onClose={closeModal}
        onSelect={handleSelectArrival}
        visible={openModal === "arrival"}
      />
      <SearchModal
        options={(vehicles.data || []).map((v) => ({
          ...v,
          title: `$${v.make} ${v.model}`,
          value: `${v.license_plate}`,
        }))}
        visible={openModal === "vehicles"}
        onClose={closeModal}
        label="Search vehicles"
        onSelect={handleSelectVehicle}
      />
    </View>
  );
};

export default DriveForm;
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});