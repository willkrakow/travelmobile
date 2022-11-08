import React from 'react'
import { LinearProgress, ListItem, Text } from '@rneui/themed'
import { useQuery } from 'react-query'
import { doc, getDoc } from 'firebase/firestore'
import { userCol } from '../hooks/useUser'
import ThemeIcon from './ThemeIcon'


interface IFriendCard {
    friendId: string
    approved: boolean;
}
const FriendCard = ({friendId, approved}: IFriendCard) => {
    const {data, isLoading} = useQuery(['users', friendId], async () => {
        const docData = await getDoc(doc(userCol, friendId));
        return {
            ...docData.data(),
            id: docData.id,
        }
    });
    return (
      <ListItem>
        {isLoading || !data ? (
          <LinearProgress />
        ) : (
          <React.Fragment>
            <ListItem.Content>
              <ListItem.Title>
                {data.first_name} {data.last_name}
              </ListItem.Title>
              {data.email && (
                <ListItem.Subtitle>{data.email}</ListItem.Subtitle>
              )}
              {data.bio && <Text>{data.bio}</Text>}
            </ListItem.Content>
            <ThemeIcon name={approved ? "checkmark" : "sync-circle"} color={approved ? "primary" : "secondary"} />
          </React.Fragment>
        )}
      </ListItem>
    );
}

export default FriendCard;