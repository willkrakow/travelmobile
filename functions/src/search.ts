// import * as functions from "firebase-functions";
// import typesense from "./services/typesense";

// export const updateUsersIndex = functions.firestore.document('/users/userId').onWrite(async (change, ctx) => {
//     const id = ctx.params.userId;
//     const newData = change.after.data() as {first_name: string, last_name: string, email: string};
    
//     await typesense.collection('users').documents.create({id, ...newData});
// })
