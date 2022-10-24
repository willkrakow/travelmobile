import React from "react";
import useVehicles from "../hooks/useVehicles";
import useTripActivities from "../hooks/useTripActivities";
import useLodging from "../hooks/useLodging";
import useFlights from "../hooks/useFlights";
import { IActivity } from "../types/Activities";
import { ILodging } from "../types/Lodging";
import { Dayjs } from "dayjs";
import { StyleSheet, View } from "react-native";
import { Input } from "@rneui/themed";
import SearchModal, { IOption } from "./SearchModal";

interface INewDriveForm {
  departure_location_name?: string;
  departure_location_id?: string;
  departure_location_type?: "lodging" | "activity";
  arrival_location_name?: string;
  arrival_location_id?: string;
  arrival_location_type?: "lodging" | "activity";
  departure_date?: Dayjs;
  vehicle_name?: string;
  vehicle_id?: string;
}

const DriveForm = () => {
  const { getAll: vehicles } = useVehicles();
  const { getAll: activities } = useTripActivities();
  const { getAll: lodging } = useLodging();

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
      id: place.place_id,
      title: place.title,
      value: place.location,
      type: place.type,
    }));
  }, [activities.data, lodging.data]);

  const handleSelectDeparture = (_: string, __: string, selected?: IOption) => {
    if (selected) {
      setData({
        ...data,
        departure_location_id: selected.id,
        departure_location_name: selected.title,
        departure_location_type: selected.type,
      });
    }
  };

  const handleSelectArrival = (_: string, __: string, selected?: IOption) => {
    if (selected) {
      setData({
        ...data,
        arrival_location_id: selected.id,
        arrival_location_name: selected.title,
        arrival_location_type: selected.type,
      });
    }
  };

  const closeModal = React.useCallback(() => {
    setOpenModal(null);
  }, []);

  const handleSelectVehicle = (id: string, value: string) => {
    setData({
      ...data,
      vehicle_id: id,
      vehicle_name: value,
    });
  };
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
          id: v.id,
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