import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {Text, ButtonGroup} from '@rneui/themed'
import { Button } from "react-native";
import useFlights from "../hooks/useFlights";

enum BookingFilter {
    FLIGHTS='flights',
    HOTELS='hotels',
    TRANSIT='transit',
}

type BookingFilters = {
    [Property in keyof typeof BookingFilter]: boolean
}

export default function Bookings(){
    const [selectedTypes, setSelectedTypes] = React.useState<BookingFilters>({
        FLIGHTS: false,
        HOTELS: false,
        TRANSIT: false,
    });

    const {getAll} = useFlights();

    const handleToggleType = (t: keyof BookingFilters) => {
        setSelectedTypes({
            ...selectedTypes,
            [t]: !selectedTypes[t]
        })
    }

    const handlePressAll = () => {
        setSelectedTypes({
            FLIGHTS: true,
            HOTELS: true,
            TRANSIT: true,
        })
    }

    const filterButtons = React.useMemo(() => {
        
    }, [])

    return (
        <SafeAreaView>
            <Text h1></Text>
            <ButtonGroup
            buttons={[
                <Button onPress={handlePressAll} title="All" />,
                <Button onPress={() => handleToggleType("FLIGHTS")} title="Flights" />,
                <Button onPress={() => handleToggleType("HOTELS")} title="Hotels" />,
                <Button onPress={() => handleToggleType("TRANSIT")} title="Transit" />,
            ]}
            />
        </SafeAreaView>
    )
}