import React from "react";
import useTripPhotos from "../hooks/useTripPhotos";
import { View } from "react-native";
import ImagePicker from "./ImagePicker";
import { Input } from "@rneui/themed";
import { ImageInfo } from "expo-image-picker";
import useTripActivities from "../hooks/useTripActivities";
import DatePicker from "@react-native-community/datetimepicker";
import dayjs, { Dayjs } from "dayjs";
import useUserId from "../hooks/useUserId";
import useLodging from "../hooks/useLodging";

interface ITripPhotoForm {
  image: ImageInfo | null;
  caption: string;
  date_taken: Dayjs;
  activity_id?: string;
  lodging_id?: string;
  place_name?: string;
}

const TripPhotos = () => {
  const { upload, getAll: getPhotos } = useTripPhotos();
  const { getAll: getActivities } = useTripActivities();
  const { getAll: getLodging } = useLodging();

  const userId = useUserId();

  const [data, setData] = React.useState<ITripPhotoForm>({
    image: null,
    caption: "",
    date_taken: dayjs(),
  });

  const handleUpload = () => {
    if (data.image === null) return;
    upload.mutate({
      metadata: {
        caption: data.caption,
        date_taken: data.date_taken.toISOString(),
        user_id: userId,
      },
      tempUri: data.image?.uri,
    });
  };

  const handlePlaceSelect = (id: string, value: string) => {
    const activityIds = getActivities?.data?.map(d => d.id);
    const lodgingIds = getLodging.data?.map(d => d.id);

    if(activityIds?.includes(id)){
        setData({
            ...data,
            lodging_id: '',
            activity_id: id,
            place_name: value,
        })
    }

    if(lodgingIds?.includes(id)){
        setData({
            ...data,
            activity_id: '',
            lodging_id: id,
            place_name: value,
        })
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <ImagePicker onSave={(img) => setData({ ...data, image: img })} />
      <Input
        onChangeText={(t) => setData({ ...data, caption: t })}
        label="Caption"
        value={data.caption}
      />
      <DatePicker
        onChange={(_, d) => setData({ ...data, date_taken: dayjs(d) })}
        value={data.date_taken.toDate()}
      />
      <Input value={data?.activity_id || data?.lodging_id} onPressIn={() => {}} label="Place tag" />
    </View>
  );
};


export default TripPhotos