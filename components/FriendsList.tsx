import React from "react";
import useFriends, { IFriend } from "../hooks/useFriends";
import { Button, Input, ListItem, SearchBar, Text } from "@rneui/themed";
import { Dimensions, View } from "react-native";
import ThemeIcon from "./ThemeIcon";
import dayjs from "dayjs";
import FriendCard from "./FriendCard";


const FriendsList = () => {
    const { searchTerm, setSearchTerm, queryUsers, getAllFriends, createFriendRequest } = useFriends();
    console.log(getAllFriends.data)
    const pendingFriendIds = React.useMemo(() => {
        if (!getAllFriends.data) return [];
        return getAllFriends.data.filter(f => !f.approved).map((f) => f.friend_id);
    }, [getAllFriends.data]);
    const friendIds = React.useMemo(() => {
        if(!getAllFriends.data) return [];
        return getAllFriends.data.filter(f => f.approved).map(f => f.friend_id)
    }, [getAllFriends.data])

    const isPendingOrApproved = (friendId: string) => {
        return pendingFriendIds.includes(friendId) || friendIds.includes(friendId);
    }

    const isPending = (friendId: string) => pendingFriendIds.includes(friendId);
    const isApproved = (friendId: string) => friendIds.includes(friendId);
    const getSentAtDate = (friendRequestId: string) => {
        const record = getAllFriends.data?.find(existingFriends => friendRequestId === existingFriends.friend_id);
        if(!record) return '';
        const dayDiff = Math.abs(dayjs(record.created_at).diff(dayjs(), "days"));
        const hourDiff = Math.abs(dayjs(record.created_at).diff(dayjs(), "hours"));
        const minuteDiff = Math.abs(dayjs(record.created_at).diff(dayjs(), "minutes"))
        console.log(dayDiff);
        console.log(minuteDiff);
        if(dayDiff > 1){
            return `Sent ${dayDiff} days ago`
        } else if (dayDiff > 0){
            return `Sent ${dayDiff} day ago`
        } else if (hourDiff > 1) {
            return `Sent ${dayDiff} hours ago`
        } else if (hourDiff > 0){
            return `Sent 1 hour ago`
        } else if (minuteDiff > 1) {
            return `Sent ${minuteDiff} minutes ago`
        } else if (minuteDiff > 0) {
            return `Sent 1 minute ago`
        } else {
            return `Sent just now`
        }
    }
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {getAllFriends.data &&
            getAllFriends.data.map((friend) => (
              <FriendCard
                key={friend.friend_id}
                friendId={friend.friend_id}
                approved={friend.approved}
              />
            ))}
        </View>
        <Input
          onChangeText={setSearchTerm}
          value={searchTerm}
          label="Search users"
        />
        <View
          style={{
            flex: 1,
            width: Dimensions.get("window").width,
            marginTop: 20,
          }}
        >
          {queryUsers.data &&
            queryUsers.data.map((result) => (
              <ListItem
                containerStyle={{ height: 100 }}
                key={result.document.id}
              >
                <ListItem.Content>
                  <ListItem.Title>
                    {result.document.first_name} {result.document.last_name}
                  </ListItem.Title>
                  {isPendingOrApproved(result.document.user_id) && (
                    <Text>{getSentAtDate(result.document.user_id)}</Text>
                  )}
                </ListItem.Content>
                {isPendingOrApproved(result.document.user_id) ? (
                  <Button
                    icon={
                      <ThemeIcon
                        name={
                          isPending(result.document.user_id)
                            ? "sync-circle"
                            : "checkmark"
                        }
                        color={"secondary"}
                      />
                    }
                    color="white"
                    type="solid"
                    disabled
                  />
                ) : (
                  <Button
                    icon={<ThemeIcon name={"person-add"} color={"white"} />}
                    color="secondary"
                    type="solid"
                    loading={createFriendRequest.isLoading}
                    disabled={createFriendRequest.isLoading}
                    onPress={() =>
                      createFriendRequest.mutate({
                        approved: false,
                        user_sent_request: true,
                        friend_sent_request: false,
                        created_at: dayjs().toISOString(),
                        friend_id: result.document.user_id,
                      })
                    }
                  />
                )}
              </ListItem>
            ))}
        </View>
      </View>
    );
}

export default FriendsList