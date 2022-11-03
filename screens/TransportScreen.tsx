import { ListItem, Text, SpeedDial, lightColors } from '@rneui/themed';
import dayjs from 'dayjs';
import React from 'react'
import { StyleSheet, View } from 'react-native'
import DirectionsCard from '../components/DirectionsCard';
import DriveCard from '../components/DirectionsCard';
import ThemeIcon from '../components/ThemeIcon';
import useDrives from '../hooks/useDrives';
import useFlights from '../hooks/useFlights';
import { TransportStackScreenProps } from '../types'

const TransportScreen = ({ navigation }: TransportStackScreenProps<"Home">) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const { getAll: flights } = useFlights();
  const {getAll: drives} = useDrives();

  return (
    <View style={styles.root}>
      <Text h4>Flights</Text>
      {!flights.isLoading &&
        flights.data &&
        flights.data.map((f) => (
          <ListItem key={f.id} containerStyle={styles.listItemContainer}>
            <ListItem.Content>
              <Text>{dayjs(f.departure_date).format("MMM DD")}</Text>
              <ListItem.Title style={styles.listItemTitle}>
                <Text h4>{f.departure_airport.local_code}</Text>
                <ThemeIcon name="arrow-forward" />{" "}
                <Text h4>{f.arrival_airport.local_code}</Text>
              </ListItem.Title>
              <ListItem.Subtitle>{f.airline.trimStart()}</ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Content>
              <ListItem.Subtitle>
                <Text style={[styles.licensePlate, styles.timeText]}>
                  Departs{" "}
                </Text>
                {dayjs(f.departure_date).format("HH:MM")}
              </ListItem.Subtitle>
              <ListItem.Subtitle>
                <Text style={[styles.licensePlate, styles.timeText]}>
                  Arrives{" "}
                </Text>{" "}
                {dayjs(f.arrival_date).format("HH:MM")}
              </ListItem.Subtitle>
              <Text style={styles.priceText}>${f.price} - <Text style={styles.seatClass}>{f.seat_class} class</Text></Text>
            </ListItem.Content>
          </ListItem>
        ))}
        <Text h4>Drives</Text>
        {!drives.isLoading && drives.data && drives.data.map(d => (
          <DirectionsCard type="drive" data={d} key={d.id} />
        ))}
      <SpeedDial
        icon={<ThemeIcon name="ellipsis-horizontal" color="white" />}
        isOpen={isOpen}
        onOpen={() => setIsOpen(!isOpen)}
        onClose={() => setIsOpen(!isOpen)}
        placement="left"
        openIcon={<ThemeIcon name="close" color="white" />}
      >
        <SpeedDial.Action
          icon={<ThemeIcon color="white" name="car" />}
          onPress={() => navigation.navigate("Vehicles")}
          title="My Vehicles"
        />
        <SpeedDial.Action
          icon={<ThemeIcon color="white" name="airplane" />}
          onPress={() => navigation.navigate("AddFlightForm")}
          title="Add Flight"
        />
        <SpeedDial.Action icon={<ThemeIcon color="white" name="speedometer-outline" />} onPress={() => navigation.navigate("AddDriveForm")} title="Add Drive" />
      </SpeedDial>
    </View>
  );
};

export default TransportScreen

const styles = StyleSheet.create({
  root: {
    padding: 10,
    flex: 1,
  },
  listItemContainer: {
    borderRadius: 20,
    shadowColor: "black",
    shadowOffset: { height: 5, width: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    marginBottom: 10,
    padding: 10,
  },
  listItemTitle: {
    marginBottom: 10,
  },
  vehicleColor: { width: 10, height: 10, borderRadius: 10 },
  licensePlate: {
    color: lightColors.grey2,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  timeText: {
    fontSize: 12,
  },
  priceText: {
    marginTop: 20,
    color: lightColors.primary,
    fontSize: 15,
  },
  seatClass: {
    color: lightColors.grey1
  }
});
