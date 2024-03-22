import {addDoc, collection} from "firebase/firestore";
import {db} from "./firebase.ts";
import { FormStateType} from "./validation.ts";

export async function createDoc(data:FormStateType) {
    return  await addDoc(collection(db, "discount"), data)
}

