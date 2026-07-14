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
import { getParticipants, getParticipant } from "./ParticipantService";
import loadElements from "./loadElements";

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
  seatlabel: string,
  participantId: string,
) {

  if (!participantId) {

    await setDoc(
      doc(db, Collections.allocations, seat),
      {
        participantId: "",
        participantName: "",
        seatlabel,
        updatedAt: Date.now(),
      }
    );

    return;
  }

  const participant = await getParticipant(participantId);

  await setDoc(
    doc(
      db,
      Collections.allocations,
      seat
    ),
    {
      seatlabel,
      participantId,
      participantName: participant.name,
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


  const snapshot = await getDocs(
    collection(
      db,
      "allocations"
    )
  );
  const participants = await getParticipants();
  const allocations = snapshot.docs.map(doc => ({
    seat: doc.id,
    ...(doc.data() as any)
  }));
  const elements = loadElements();
  const seatsByLabel = new Map(
    elements
      .filter(e => e.type === "seat")
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
    const seatId = seatsByLabel.get(allocation.seat);

    if (!participantId) {
      console.warn(`Participant not found: ${allocation.participant}`);
      continue;
    }
    if (!seatId) {
      console.warn("Seat not found:", allocation.seat);
      continue;
    }
    console.log(seatId);

    await allocate(
      seatId,
      allocation.seat,
      participantId
    );

  }

}