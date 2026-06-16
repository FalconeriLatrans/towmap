import {
    collection,
    addDoc
} from "firebase/firestore";

import { db } from "./Firebase";

export default async function testFirestore() {

    await addDoc(
        collection(db, "test"),
        {
            name: "Roberto",
            timestamp: Date.now()
        }
    );

    console.log("Firestore OK");
}