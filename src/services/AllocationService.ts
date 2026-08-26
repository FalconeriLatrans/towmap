import {
  collection,
  doc,
  getDocs,
  setDoc,
  onSnapshot
  ,writeBatch,
  deleteDoc
} from "firebase/firestore";

import { db } from "./Firebase";
import type { Allocation } from "../types/Allocation";
import { Collections } from "../config/Collections";
import { getParticipants } from "./ParticipantService";
import loadElements from "./loadElements";

type LegacyAllocation = {
  participant: string;
};

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
      city: doc.id,
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
  city: string,
  participantId: string
) {
  if (!participantId) {
    await deleteDoc(doc(db, Collections.allocations, city));
    return;
  }
  await setDoc(
    doc(
      db,
      Collections.allocations,
      city
    ),
    {
      participantId,
      updatedAt: Date.now()
    }
  );
}

export async function replaceAllocations(assignments: Record<string, string>) {
  const snapshot = await getDocs(collection(db, Collections.allocations));
  const batch = writeBatch(db);

  snapshot.docs.forEach(allocation => batch.delete(allocation.ref));

  Object.entries(assignments).forEach(([city, participantId]) => {
    batch.set(doc(db, Collections.allocations, city), {
      participantId,
      updatedAt: Date.now(),
    });
  });

  await batch.commit();
}

export async function getAllocation(
  city: string
) {

  const allocations =
    await getAllocations();

  return allocations.find(
    a => a.city === city
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
            city: doc.id,
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


  const snapshot = await getDocs(
    collection(
      db,
      "allocations"
    )
  );
  const participants = await getParticipants();
  const allocations = snapshot.docs.map(doc => ({
    city: doc.id,
    ...(doc.data() as LegacyAllocation)
  }));
  const elements = loadElements();
  const citiesByLabel = new Map(
    elements
      .filter(e => e.type === "city")
      .map(e => [e.label, e.id])
  );

  const participantsByName = new Map(
    participants.map(p => [p.name, p.id])
  );

  for (const allocation of allocations) {

    console.log(allocation);

    const participantId =
    participantsByName.get(
        allocation.participant
    );
    const cityId = citiesByLabel.get(allocation.city);

    if (!participantId) {
      console.warn(`Participant not found: ${allocation.participant}`);
      continue;
    }
    if (!cityId) {
      console.warn("City not found:", allocation.city);
      continue;
    }
    console.log(cityId);

    await allocate(
      cityId,
      participantId
    );

  }

}
