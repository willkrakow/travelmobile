import React from 'react'
import {ImageInfo, launchImageLibraryAsync, MediaTypeOptions} from 'expo-image-picker'
import { View } from 'react-native';
import { Button, Image } from '@rneui/themed';

interface IImagePicker {
    onSave: (result: ImageInfo) => void
}
export default function ImagePicker({onSave}: IImagePicker) {
  const [image, setImage] = React.useState<ImageInfo | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result);
      onSave(result)
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 20, paddingBottom: 40 }}>
      <Button color="primary" type="outline" title="Choose cover image" onPress={pickImage} />
      {image && <Image source={{ uri: image.uri }} style={{ width: 200, height: 200 }} />}
    </View>
  );
}