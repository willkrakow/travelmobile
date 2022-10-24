import React from 'react'
import { ScrollView, View } from 'react-native';
import { ITrip } from '../types/Trips'
import dayjs from 'dayjs';
import { Input, Button } from '@rneui/themed'
import ImagePicker from './ImagePicker';
import { ImageInfo } from 'expo-image-picker';
import useFirebaseTrips from '../hooks/useFirebaseTrips';
import DatePicker from '@react-native-community/datetimepicker';
import { ProfileStackScreenProps } from '../types';
import useUserId from '../hooks/useUserId';

type INewTrip = Omit<ITrip, "id">

interface INewTripForm {
    title: string;
    departure_date: dayjs.Dayjs;
    return_date: dayjs.Dayjs;
    parties: string[];
    origin_location: string;
    cover_image?: ImageInfo;
}
interface IDateObject {
  day: string;
  month: string;
  year: string;
}

const TripFormModal = ({ navigation, route }: ProfileStackScreenProps<"CreateTrip">) => {
  const user_id = useUserId();
  const [data, setData] = React.useState<INewTripForm>({
    departure_date: dayjs(),
    return_date: dayjs(),
    title: "New Trip",
    origin_location: "Home",
    parties: [],
  });

  const { create } = useFirebaseTrips();

  const handleChange = (name: keyof INewTrip, text: string) => {
    setData({
      ...data,
      [name]: text,
    });
  };

  const handleCancel = () => {
    navigation.goBack()
  }

  const handleUploadImage = (image: ImageInfo) =>
    setData({
      ...data,
      cover_image: image,
    });

  const handleSubmit = () => {
    create.mutate(
      {
        user_id,
        departure_date: data.departure_date.toISOString().replace("Z", ""),
        return_date: data.return_date.toISOString().replace("Z", ""),
        title: data.title,
        parties: data.parties,
        origin_location: data.origin_location,
        cover_image: data.cover_image,
      },
      {
        onSuccess: () => navigation.navigate("Home"),
      }
    );
  };

  return (
    <ScrollView contentContainerStyle={{ paddingTop: 30, paddingBottom: 30 }}>
      <Input
        value={data.title}
        onChangeText={(text) => handleChange("title", text)}
        label="Title"
      />
      <View style={{ display: "flex", justifyContent: "space-between" }}>
        <DatePicker
          value={data.departure_date.toDate()}
          style={{ flex: 1 }}
          onChange={(_, d) => setData({ ...data, departure_date: dayjs(d) })}
        />
        <DatePicker
          value={data.return_date.toDate()}
          style={{ flex: 1 }}
          onChange={(_, d) => setData({ ...data, return_date: dayjs(d) })}
        />
      </View>
      <ImagePicker onSave={handleUploadImage} />
      <Button loading={create.isLoading} disabled={create.isLoading} type="solid" color="primary" onPress={handleSubmit}>
        Save
      </Button>
      <Button onPress={handleCancel} title="Cancel" type="outline" color="primary" />
    </ScrollView>
  );
};

export default TripFormModal