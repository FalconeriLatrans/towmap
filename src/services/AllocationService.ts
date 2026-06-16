import {
  collection,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";

import { db } from "./Firebase";
import type { Allocation } from "../types/Allocation";

const STORAGE_KEY = "towmap_allocations";

export async function getAllocations() {

  const snapshot =
    await getDocs(
      collection(
        db,
        "allocations"
      )
    );

  return snapshot.docs.map(
    doc => ({
      seat: doc.id,
      ...doc.data()
    })
  ) as Allocation[];
}

export function saveAllocations(
  allocations: Allocation[]
) {
  console.log(
    "salvando",
    allocations
  );
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(allocations)
  );
}

export async function allocate(
  seat: string,
  participant: string
) {

  await setDoc(
    doc(
      db,
      "allocations",
      seat
    ),
    {
      participant,
      updatedAt: Date.now()
    }
  );

}

export async function getAllocation(
  seat: string
) {

  const allocations =
    await getAllocations();

  return allocations.find(
    a => a.seat === seat
  );

}