import React from "react";
import { Input, Button, FAB, ButtonGroup, Text, useTheme } from "@rneui/themed";
import { TransportStackScreenProps } from "../types";
import useUserId from "../hooks/useUserId";
import dayjs, { Dayjs } from "dayjs";
import { ScrollView, View } from "react-native";
import SearchModal from "./SearchModal";
import ThemeIcon from "./ThemeIcon";
import useFlights from "../hooks/useFlights";
import { useTripContext } from "../hooks/useTripContexts";
import useAirports from "../hooks/useAirports";
import useAirlines from "../hooks/useAirlines";

enum EAirlines {
  AMERICAN = "American",
  ICELANDAIR = "IcelandAir",
  DELTA = "Delta",
  SOUTHWEST = "Southwest",
  UNITED = "United",
  SPIRIT = "Spirit",
  JETBLUE = "JetBlue",
  LUFTHANSA = "Lufthansa",
  BRITISHAIR = "British Airways",
  FRONTIER = "Frontier",
  ALASKAAIR = "Alaska Air",
  HAWAIIANAIR = "Hawaiian Air",
  IBERIA = "Iberia",
  QANTAS = "Qantas",
}

interface INewFlightForm {
  airline: string;
  flight_number: string;
  departure_date: Dayjs;
  departure_airport_id: string;
  arrival_date: Dayjs;
  arrival_airport_id: string;
  seat_class: number;
  price: string;
}

const SEAT_CLASSES = ["First", "Business", "Economy"];
const FlightForm = ({
  navigation,
}: TransportStackScreenProps<"AddFlightForm">) => {
  const user_id = useUserId();
  const { tripId = "" } = useTripContext();
  const { getAll: airports } = useAirports();
  const { getAll: airlines } = useAirlines();

  const { create } = useFlights();
  const { theme } = useTheme();
  const [airportSearch, setAirportSearch] = React.useState<
    "arrivals" | "departures" | null
  >(null);
  const [airlineSearch, setAirlineSearch] = React.useState<boolean>(false);
  const [data, setData] = React.useState<INewFlightForm>({
    airline: EAirlines.AMERICAN,
    flight_number: "",
    departure_date: dayjs(),
    arrival_date: dayjs(),
    seat_class: 2,
    price: "",
    arrival_airport_id: "",
    departure_airport_id: "",
  });

  const goBack = React.useCallback(() => {
    navigation.navigate("Home");
  }, [navigation]);

  const onSave = () => {
    const arrival_airport =
      airports.data?.find((a) => a.id === data.arrival_airport_id) || null;
    const departure_airport =
      airports.data?.find((a) => a.id === data.departure_airport_id) || null;
    if (arrival_airport === null || departure_airport === null) return;

    create.mutate(
      {
        arrival_airport,
        arrival_date: data.arrival_date.toISOString(),
        departure_airport,
        departure_date: data.departure_date.toISOString(),
        flight_number: data.flight_number,
        seat_class: SEAT_CLASSES[data.seat_class],
        airline: `${data.airline}`,
        price: parseInt(data.price, 10),
        user_id,
        trip_id: tripId,
      },
      {
        onSuccess: () => {
          navigation.navigate("Home");
        },
      }
    );
  };

  const selectedDepartureAirportName = React.useMemo(() => {
    if (data.departure_airport_id.length === 0) {
      return "";
    }
    return (
      airports.data?.find((a) => a.id === data.departure_airport_id)?.name || ""
    );
  }, [airports, data.departure_airport_id]);

  const selectedArrivalAirportName = React.useMemo(() => {
    if (data.arrival_airport_id.length === 0) {
      return "";
    }
    return (
      airports.data?.find((a) => a.id === data.arrival_airport_id)?.name || ""
    );
  }, [airports, data.arrival_airport_id]);

  const handleCloseAirportSearch = () => {
    setAirportSearch(null);
  };
  return (
    <View style={{ flex: 1, paddingTop: 20, paddingBottom: 20 }}>
      <ScrollView>
        <Input
          value={selectedDepartureAirportName}
          onPressIn={() => setAirportSearch("departures")}
          label="Departing from"
          leftIcon={<ThemeIcon name="location" />}
        />
        <Input
          value={selectedArrivalAirportName}
          onPressIn={() => setAirportSearch("arrivals")}
          label="Arriving at"
          leftIcon={<ThemeIcon name="location" />}
        />
        <Input
          value={data.airline}
          onPressIn={() => setAirlineSearch(true)}
          label="Airline"
          leftIcon={<ThemeIcon name="business" />}
        />
        <Input
          value={data.flight_number}
          onChangeText={(t) => setData({ ...data, flight_number: t })}
          leftIcon={<ThemeIcon name="contract" />}
          label="Flight number"
        />
        <Input
          leftIcon={<ThemeIcon name="logo-usd" />}
          label="Price"
          value={data.price}
          onChangeText={(t) => setData({ ...data, price: t })}
        />
        <Text
          style={{
            color: theme.colors.grey3,
            marginLeft: 10,
            fontSize: 17,
            fontWeight: "300",
          }}
        >
          Class
        </Text>
        <ButtonGroup
          selectedIndex={data.seat_class}
          containerStyle={{ borderRadius: 20 }}
          button={Button}
          buttons={["First", "Business", "Economy"]}
          onPress={(val) => setData({ ...data, seat_class: val })}
        />
        <Button
          type="solid"
          color="primary"
          onPress={onSave}
          title="Save"
          style={{ margin: 20 }}
        />
        <FAB
          placement="right"
          onPress={goBack}
          icon={<ThemeIcon name="close" color="white" />}
          style={{ zIndex: 100 }}
        />
      </ScrollView>
      <SearchModal
        label="Search departure airports"
        onClose={handleCloseAirportSearch}
        onSelect={(id) => setData({ ...data, departure_airport_id: id })}
        options={(airports.data || []).map((a) => ({
          id: a.id,
          title: a.name,
          value: `${a.municipality ?? ""} ${a.iso_region ?? ""}`,
          index: a.local_code ?? "",
          secondaryIndex: a.municipality ?? "",
        }))}
        visible={airportSearch === "departures"}
      />
      <SearchModal
        label="Search arrival airports"
        onClose={handleCloseAirportSearch}
        onSelect={(id) => setData({ ...data, arrival_airport_id: id })}
        options={(airports.data || [])?.map((a) => ({
          id: a.id,
          title: a.name,
          value: `${a.municipality ?? ""} ${a.iso_region ?? ""}`,
          index: a.local_code ?? "",
          secondaryIndex: a.municipality ?? "",
        }))}
        visible={airportSearch === "arrivals"}
      />
      <SearchModal
        label="Search airlines"
        onClose={() => setAirlineSearch(false)}
        onSelect={(_, value) => setData({ ...data, airline: value })}
        options={(airlines.data || []).map((a) => ({
          id: a.id,
          title: "",
          value: a.name,
          image: a.logo_url,
        }))}
        visible={airlineSearch}
      />
    </View>
  );
};

export default FlightForm;
