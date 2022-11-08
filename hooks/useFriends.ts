import {
  CollectionReference,
  doc,
  getDoc,
  collection,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useUserId from "./useUserId";
import { userCol } from "./useUser";
import React from "react";
import { ITypesenseQueryHit, IUserRecord } from "../types/Typesense";
import useThrottle from "./useThrottle";
export interface IFriendRelation {
    sent_by_user_id: string;
    received_by_user_id: boolean;
    created_at: string;
    approved: boolean;
}

export interface IFriend {
    friend_id: string;
    friend_sent_request: boolean;
    user_sent_request: boolean;
    created_at: string;
    approved: boolean;
}
export const createUserFriendCollection = (userId: string) => collection(userCol, userId, 'friends') as CollectionReference<IFriend>;
const useFriends = () => {
  const userId = useUserId();
  const client = useQueryClient();
  const userFriendCollection = createUserFriendCollection(userId);
  const getAllFriends = useQuery(
    ["users", userId, 'friends'],
    async () => {
      const data = await getDoc(doc(userCol, userId));
      return data.data()?.friends
    },
    {
      enabled: userId.length > 0,
      refetchOnMount: true,
      refetchInterval: 1000 * 20,
    }
  );

  const createFriendRequest = useMutation(async (data: IFriend) => {
    await updateDoc(doc(userCol, userId), {
        friends: arrayUnion(data)
    });

    await updateDoc(doc(userCol, data.friend_id), {
      friends: arrayUnion({
        friend_id: userId,
        approved: false,
        created_at: data.created_at,
        user_sent_request: false,
        friend_sent_request: true,
      })
    })
  }, {
    onSuccess: () => {
      client.invalidateQueries(['users', userId, 'friends']);
      client.refetchQueries(['users', userId, 'friends']);
    }
  });

  const approveFriendRequest = useMutation(async (friendId: string) => {
    await updateDoc(doc(userFriendCollection, friendId), {
        approved: true,
    })
  })

  const [searchTerm, setSearchTerm] = React.useState('');
  const throttledSearch = useThrottle(searchTerm, 1500);
  const queryUsers = useQuery(['users', 'query', throttledSearch], async () => {
      const apiResponse = await fetch(
        `http://localhost:5001/travelmobile-48740/us-central1/fakeQuery?q=${searchTerm}&query_by=${encodeURIComponent('first_name')}`
      );
      const data = await apiResponse.json();
      return data.hits as ITypesenseQueryHit<IUserRecord>[]
    
  }, {enabled: throttledSearch.length > 2})

  return { getAllFriends, queryUsers, searchTerm, setSearchTerm, createFriendRequest, approveFriendRequest };
};

export default useFriends;
