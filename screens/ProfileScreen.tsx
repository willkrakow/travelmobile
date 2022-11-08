import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Image, Input, ListItem } from "@rneui/themed";
import useProfileImage from "../hooks/useProfileImage";
import {getAuth, updateProfile} from 'firebase/auth'
import useUser from "../hooks/useUser";
import dayjs from "dayjs";
import { ProfileStackScreenProps } from "../types";
import useFriends from "../hooks/useFriends";
import FriendsList from "../components/FriendsList";

interface INewProfileForm {
  first_name: string;
  last_name: string;
  birthday: dayjs.Dayjs;
  state: string;
  country: string;
  bio: string;
}
export default function ProfileScreen({navigation}: ProfileStackScreenProps<"Home">) {
  const { imageUrl } = useProfileImage();
  const [hasChanges, setHasChanges] = React.useState<boolean>(false);
  const { searchTerm, setSearchTerm, queryUsers } = useFriends();

  const {getCurrent, update} = useUser();
  const [data, setData] = React.useState<INewProfileForm>({
    first_name: '',
    last_name: '',
    birthday: dayjs(),
    state: "",
    country: "",
    bio: "",
  })

  const {isLoading, data: userData} = getCurrent;
  React.useEffect(() => {
    if(!isLoading && userData){
      setData({
        ...data,
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        birthday: dayjs(userData.birthday),
        state: userData.state || '',
        country: userData.country || '',
        bio: userData.bio || '',
      })
    }
  }, [isLoading, userData])

  const handleChange = (key: keyof INewProfileForm, text: string) => {
    if(!hasChanges) {
      setHasChanges(true)
    }
    setData({
      ...data,
      [key]: text
    })
  }

  const handleSave = async () => {
    const auth = getAuth()
    if(auth.currentUser === null) return;

    await updateProfile(auth.currentUser, {
      displayName: `${data.first_name} ${data.last_name}`,
    });

    update.mutate({
      bio: data.bio,
      birthday: data.birthday.toISOString(),
      country: data.country,
      first_name: data.first_name,
      last_name: data.last_name,
      state: data.state,
      phone_number: auth.currentUser?.phoneNumber || '',
      email: auth.currentUser?.email || '',
      friends: []
    })
  }

  return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 20,
            paddingBottom: 20,
          }}
        >
          <Image
            containerStyle={{
              height: 100,
              width: 100,
              borderRadius: 50,
              overflow: "hidden",
            }}
            source={{ uri: imageUrl, height: 100, width: 100 }}
          />
        </View>
        <ListItem>
          <ListItem.Input
            label="First Name"
            value={data.first_name}
            textContentType="givenName"
            onChangeText={(t) => handleChange("first_name", t)}
          />
        </ListItem>
        <ListItem>
          <ListItem.Input
            label="Last Name"
            value={data.last_name}
            textContentType="familyName"
            onChangeText={(t) => handleChange("last_name", t)}
          />
        </ListItem>
        <ListItem>
          <ListItem.Input
            multiline
            numberOfLines={5}
            scrollEnabled
            value={data.bio}
          />
        </ListItem>
        <Button
          type="solid"
          color="primary"
          onPress={handleSave}
          title="Save"
        />
        <View style={{ flex: 1 }}>
          <Button title="My Friends" type="outline" color="primary" onPress={() => navigation.navigate("Friends")} />
        </View>
      </View>
  );
}
