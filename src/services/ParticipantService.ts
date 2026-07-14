//import participant from "../data/participants.csv";
import participantscsv from "../data/participants.csv?raw";
import { getAllocations } from "./AllocationService";
import { db } from "./Firebase";
import type { Participant } from "../types/Participant";
import { Collections } from "../config/Collections";
import {
  collection,
  getDocs,
  //getDoc,
  setDoc,
  doc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

export async function getParticipants() {

  const snapshot = await getDocs(collection(db, Collections.participants));

  return snapshot.docs
    .map(doc => ({
      id: doc.id,
      ...doc.data(),
    }as Participant))
    .sort((a, b) => a.order - b.order) as Participant[];
}

export async function getUnallocatedParticipants(): Promise<Participant[]> {

  const participants = await getParticipants();
  const allocations = await getAllocations();

  const allocatedIds = new Set(
      allocations.map(a => a.participantId)
  );

  return participants
      .filter(p => p.isMember)
      .filter(p => !allocatedIds.has(p.id))
      .sort((a, b) => a.order - b.order);

}

export function subscribeParticipants(
  callback: (participants: Participant[]) => void
) {
  return onSnapshot(
    collection(db, Collections.participants),
    snapshot => {
      const participants =
        snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          }as Participant))
          .sort((a, b) => a.order - b.order);
      callback(
        participants as Participant[]
      );
    }
  );
}

export async function addParticipant(participant: Participant) {

  await setDoc(
    doc(
      db,
      Collections.participants,
      participant.id
    ),
    participant
  );
  return console.log("addParticipant");
}

export async function updateParticipant(participant: Participant) {
  await setDoc(
    doc(
      db,
      Collections.participants,
      participant.id
    ),
    participant
  );
  return console.log("updateParticipant");
}

export async function deleteParticipant(id:string) {
  await deleteDoc(
    doc(
      db,
      Collections.participants,
      id,
    )
  );
  return console.log("deleteParticipant");
}

export async function moveParticipant(
  //id:string, newOrder
  ) {
  return console.log("moveParticipant");
}

export async function generateToken() {
  return console.log("generateToken");
}

export async function importParticipants() {
  
  const lines = participantscsv
    .trim()
    .split("\n")
    .slice(1); // pula o cabeçalho

  console.log(`${lines.length} participants found.`);

  for (const line of lines) {

    const [
      id,
      name,
      level,
      power,
      order,
      isMember
    ] = line
      .split(",")
      .map(v => v.trim());

      console.log(`Importing ${name}...`);

    if (!id) {
      console.warn("Invalid participant:", line );
      continue;
    }

    await setDoc(
      doc(
        db,
        Collections.participants,
        id
      ),
      {
        name,
        level: Number(level),
        power: Number(power),
        order: Number(order),
        token: "",
        isMember: isMember === "true"
      }
    );
  }
  console.log("Import completed.");
}