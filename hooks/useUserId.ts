import React from 'react'
import { getAuth } from 'firebase/auth'

const useUserId = () => {
    const {currentUser} = getAuth();

    if(currentUser === null) {
        return ''
    }
    return currentUser.uid
}

export default useUserId;