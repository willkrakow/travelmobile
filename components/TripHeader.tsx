import React, { useEffect } from "react";
import { Dialog, Header, ListItem } from "@rneui/themed";
import useFirebaseTrip from "../hooks/useFirebaseTrip";
import useFirebaseTrips from "../hooks/useFirebaseTrips";
import { useTripContext } from "../hooks/useTripContexts";

const TripHeader = () => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const { tripId = "", changeTripId = () => {} } = useTripContext();
  const {
    query: { data },
  } = useFirebaseTrip();
  const {
    query: { data: allTrips },
  } = useFirebaseTrips();


  useEffect(() => {
    if(tripId.length === 0){
        if(allTrips && allTrips?.length > 0){
            changeTripId(allTrips[0].id)
        }
    }
  }, [allTrips, tripId])
  const handleDropdown = () => setDropdownOpen((prev) => !prev);
  return (
    <React.Fragment>
      <Header
        leftComponent={{
          icon: "arrow-downward",
          color: "primary",
          onPress: handleDropdown,
        }}
        centerComponent={{
          text: data?.title,
        }}
      />
      <Dialog isVisible={dropdownOpen} onBackdropPress={handleDropdown}>
        <Dialog.Title title="Select a trip" />
        {allTrips?.map((trip) => (
          <ListItem key={trip.id}>
            <ListItem.Title>{trip.title}</ListItem.Title>
            <ListItem.CheckBox
              checked={tripId === trip.id}
              onPress={() => changeTripId(trip.id)}
            />
          </ListItem>
        ))}
      </Dialog>
    </React.Fragment>
  );
};


export default TripHeader