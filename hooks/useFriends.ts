import {
  addDoc,
  CollectionReference,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  collection,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { useMutation, useQuery } from "react-query";
import useUserId from "./useUserId";
import { userCol } from "./useUser";
import React from "react";
import { IUser } from "../types/User";
import dayjs from "dayjs";

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
  
  const userFriendCollection = createUserFriendCollection(userId);
  const getAllFriends = useQuery(
    ["users", userId, 'friends'],
    async () => {
      const q = query(userFriendCollection);
      const { docs } = await getDocs(q);

      const withData = await Promise.all(docs.map(async (l) => {
        const friendData = await getDoc(doc(userCol, l.data().friend_id));
        return {
            ...l.data(),
            id: l.id,
            friend: {
                ...friendData.data(),
                id: friendData.id,
            }
        }
      }));

      return withData
    },
    {
      enabled: userId.length > 0,
      refetchOnMount: true,
      refetchInterval: 1000 * 60,
    }
  );

  const createFriendRequest = useMutation(async (data: IFriend) => {
    await updateDoc(doc(userCol, userId), {
        friends: arrayUnion(data)
    })
  });

  const approveFriendRequest = useMutation(async (friendId: string) => {
    await updateDoc(doc(userFriendCollection, friendId), {
        approved: true,
    })
  })

  const [searchTerm, setSearchTerm] = React.useState('');
  const [userResults, setUserResults] = React.useState<(IUser & {id: string})[]>([]);

  const queryUsers = useQuery(['users'], async () => {
      const idResult = await getDoc(doc(userCol, searchTerm));
      if (idResult?.exists()){
        return setUserResults([{
            ...idResult.data(),
            id: idResult.id,
        }])
      }
    const emailQuery = query(userCol, where('email', '==', searchTerm));
    const nameQuery = query(userCol, where("first_name", '==', searchTerm), where("last_name", '==', searchTerm));
    
    const results = await Promise.all([emailQuery, nameQuery].map(async q => await getDocs(q)));
    setUserResults(results.flatMap(d => d.docs).map(d => ({
        ...d.data(),
        id: d.id,
    })))
    
  })

  return { getAllFriends, queryUsers, searchTerm, setSearchTerm, userResults, createFriendRequest, approveFriendRequest };
};

export default useFriends;
