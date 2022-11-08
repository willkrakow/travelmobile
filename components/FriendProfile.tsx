import React from 'react'
import { Divider, LinearProgress, Text } from '@rneui/themed'
import { View } from 'react-native'
import useFriends from '../hooks/useFriends';
import { useQuery } from 'react-query';
import { doc, getDoc } from 'firebase/firestore';
import { userCol } from '../hooks/useUser';
import MyModal from './MyModal';
import dayjs from 'dayjs';
import useUserId from '../hooks/useUserId';

interface IFriendProfile {
    friendId: string;
    visible: boolean;
    onDismiss: () => void;

}


const getLinkedFriendData = async (userAId: string, userBId: string) => {
        const userAData = await getDoc(doc(userCol, userAId));
        const userBData = await getDoc(doc(userCol, userBId));
        const friendship = userAData.data()?.friends.find(f => f.friend_id === userBId);
        const userAJson = userAData.data();
        const userBJson = userBData.data();

        const formattedLocation = userBJson?.country === userAJson?.country 
        ? userBJson?.state
        : `${userBJson?.state}, ${userBJson?.country}`

        return {
            id: userBData.id,
            first_name: userBJson?.first_name,
            last_name: userBJson?.last_name,
            birthday: userBJson?.birthday,
            bio: userBJson?.bio,
            location: formattedLocation,
            email: userBJson?.email,
            phone_number: userBJson?.phone_number,
            friendship,
        }
}

const FriendProfile = ({friendId, visible, onDismiss}: IFriendProfile) => {
    const userId = useUserId();
    const {data, isLoading} = useQuery(['users', userId, friendId], async () => {
        return await getLinkedFriendData(userId, friendId)
    })

    return (
        <MyModal visible onDismiss={onDismiss} presentationStyle='formSheet'>
            {isLoading && <LinearProgress />}
            {data && (
            <View>
                <Text h3>{data?.first_name} {data?.last_name}</Text>
                <Text>Friends since {dayjs(data.friendship?.created_at).format('MMM YYYY')}</Text>
                <Divider />
                <Text>{data.location}</Text>
                {data.bio && <Text>{data.bio}</Text>}
                {data.email && <Text>{data.email}</Text>}
                {data.phone_number && <Text>{data.phone_number}</Text>}
            </View>
            )}
        </MyModal>
    )
}