import {
  collection,
  doc,
  getDocs,
  setDoc,
  onSnapshot
} from "firebase/firestore";

import { db } from "./Firebase";
import type { Allocation } from "../types/Allocation";
import { Collections } from "../config/Collections";

const STORAGE_KEY = "towmap_allocations";

export async function getAllocations() {

  const snapshot =
    await getDocs(
      collection(
        db,
        Collections.allocations
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
      Collections.allocations,
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

export async function exportBackup() {

  const allocations =
    await getAllocations();

  return {
    version: 1,
    exportedAt:
      new Date().toISOString(),
    allocations,
  };

}

export function subscribeAllocations(
  callback: (
    allocations: Allocation[]
  ) => void
) {

  return onSnapshot(
    collection(
      db,
      Collections.allocations
    ),
    snapshot => {
      const allocations =
        snapshot.docs.map(
          doc => ({
            seat: doc.id,
            ...doc.data()
          })
        );

      callback(
        allocations as Allocation[]
      );
    }
  );

}

export async function migrateAllocations() {

  const participants = await getParticipants();
  const allocations = await getAllocations();

  const participantsByName = new Map(
      participants.map(p => [p.name, p.id])
  );

  for (const allocation of allocations) {

      const participantId =
          participantsByName.get(
              allocation.participant
          );

      if (!participantId) {

          console.warn(
              `Participant not found: ${allocation.participant}`
          );

          continue;

      }

      await allocate(
          allocation.seat,
          participantId
      );

  }

}