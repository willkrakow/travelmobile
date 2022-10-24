import { Button, ButtonGroup, FAB, Input, Text, useTheme } from "@rneui/themed";
import React from "react";
import { ScrollView, View } from "react-native";
import useUserId from "../hooks/useUserId";
import useVehicleOptions from "../hooks/useVehicleOptions";
import useVehicles from "../hooks/useVehicles";
import { EVehicleColor, EVehicleType } from "../types/Vehicles";
import { TransportStackScreenProps } from "../types";
import SearchModal from "./SearchModal";
import ThemeIcon from "./ThemeIcon";
import { COLOR_CONTRAST_TEXT, COLOR_LABELS } from "../constants/vehicles";

interface INewVehicleForm {
  type: EVehicleType;
  rental_agency?: string;
  owner?: string;
  make: string;
  model: string;
  year?: string;
  color: EVehicleColor;
  booking_reference?: string;
  license_plate: string;
}

const VehicleForm = ({navigation}: TransportStackScreenProps<"AddVehicleForm">) => {
  const [isSelectingMake, setIsSelectingMake] = React.useState<boolean>(false);
  const user_id = useUserId();
  const {theme} = useTheme();

  const [data, setData] = React.useState<INewVehicleForm>({
    type: EVehicleType.RENTAL,
    rental_agency: "",
    owner: "",
    make: "",
    model: "",
    year: "",
    color: EVehicleColor.BLACK,
    booking_reference: "",
    license_plate: "",
  });
  const { makes, models } = useVehicleOptions(data?.make, data?.year);
  const { create } = useVehicles();

  const handleChange = (
    key: keyof Omit<INewVehicleForm, "type">,
    text: string
  ) => {
    setData({
      ...data,
      [key]: text,
    });
  };

  const handleSubmit = () => {
    create.mutate({
      ...data,
      user_id,
    }, {
        onSuccess: goBack
    });
  };

  const goBack = React.useCallback(() => {
  }, [navigation])

  return (
    <View style={{ flex: 1, paddingTop: 20, paddingBottom: 20 }}>
      <FAB
        placement="right"
        onPress={goBack}
        icon={<ThemeIcon name="close" color="white" />}
        style={{ zIndex: 100 }}
      />
      <ScrollView>
        <ButtonGroup
          containerStyle={{ borderRadius: 20, overflow: "hidden" }}
          buttons={["Rental", "Loaner", "Personal"]}
          selectedIndex={
            ["Rental", "Loaner", "Personal"].indexOf(data.type) || 0
          }
          onPress={(index) =>
            //@ts-ignore
            setData({ ...data, type: ["Rental", "Loaner", "Personal"][index] })
          }
        />
        <Input
          value={data.make}
          onPressIn={() => setIsSelectingMake(true)}
          label="Make"
        />
        <Input
          value={data.model}
          onChangeText={(t) => handleChange("model", t)}
          label="Model"
        />
        <Input
          value={data.year}
          onChangeText={(t) => handleChange("year", t)}
          label="Year"
          keyboardType="number-pad"
          maxLength={4}
        />
        <Text
          style={{
            color: theme.colors.grey3,
            fontSize: 16,
            fontWeight: "bold",
            paddingLeft: 10,
          }}
        >
          Color
        </Text>
        <ButtonGroup
          containerStyle={{ borderRadius: 20 }}
          buttonContainerStyle={{ minWidth: 70 }}
          buttons={Object.values(EVehicleColor)}
          onPress={(index) =>
            setData({ ...data, color: Object.values(EVehicleColor)[index] })
          }
          selectedTextStyle={{ color: COLOR_CONTRAST_TEXT[data.color] }}
          selectedButtonStyle={{ backgroundColor: COLOR_LABELS[data.color] }}
          selectedIndex={Object.values(EVehicleColor).indexOf(
            data.color as EVehicleColor
          )}
        />
        <Input
          value={data.license_plate}
          onChangeText={(t) => handleChange("license_plate", t)}
          label="LPN"
        />
        {data.type === "Rental" && (
          <>
            <Input
              value={data.rental_agency}
              label="Rental agency"
              onChangeText={(t) => handleChange("rental_agency", t)}
            />
            <Input
              value={data.booking_reference}
              label="Booking reference"
              onChangeText={(t) => handleChange("booking_reference", t)}
            />
          </>
        )}
        <Button
          type="solid"
          color="primary"
          style={{ margin: 10 }}
          onPress={handleSubmit}
          loading={create.isLoading}
          disabled={create.isLoading}
        >
          Save Vehicle
        </Button>
      </ScrollView>
      <SearchModal
        label={"Search makes"}
        visible={isSelectingMake && !makes.isLoading}
        onClose={() => setIsSelectingMake(false)}
        onSelect={(_, v) => handleChange("make", v)}
        options={(makes?.data || []).map(m => ({
          id: m.id,
          value: m.value,
          title: m.value,
        })) || []}
      />
    </View>
  );
};

export default VehicleForm;
