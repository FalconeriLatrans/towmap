//import participant from "../data/participants.csv";
import participantscsv from "../data/participants.csv?raw";
import { getAllocations } from "./AllocationService";
import { db } from "./Firebase";
import type { Participant } from "../types/Participant";
import { Collections } from "../config/Collections";
import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  doc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  query,
  where,
} from "firebase/firestore";

export async function getParticipants() {

  const snapshot = await getDocs(collection(db, Collections.participants));

  return snapshot.docs
    .map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))
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
          }))
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

export async function deleteParticipant(id) {
  await deleteDoc(
    doc(
      db,
      Collections.participants,
      id
    )
  );
  return console.log("deleteParticipant");
}

export async function moveParticipant(id, newOrder) {
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
      console.warn("Invalid participant:", line);
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

export async function changeParticipantId(
  oldId: string,
  newId: string
) {
  if (oldId === newId) return;

  const oldParticipantRef = doc(
    db,
    Collections.participants,
    oldId
  );

  const newParticipantRef = doc(
    db,
    Collections.participants,
    newId
  );

  // Confirma que o participante antigo existe
  const oldParticipantSnapshot =
    await getDoc(oldParticipantRef);

  if (!oldParticipantSnapshot.exists()) {
    throw new Error(
      `Participant ID "${oldId}" does not exist.`
    );
  }

  // Impede sobrescrever outro participante
  const newParticipantSnapshot =
    await getDoc(newParticipantRef);

  if (newParticipantSnapshot.exists()) {
    throw new Error(
      `Participant ID "${newId}" already exists.`
    );
  }

  // Procura allocations ligadas ao ID antigo
  const allocationsQuery = query(
    collection(db, Collections.allocations),
    where("participantId", "==", oldId)
  );

  const allocationsSnapshot =
    await getDocs(allocationsQuery);

  const batch = writeBatch(db);

  // Copia o participante antigo para o novo documento
  batch.set(
    newParticipantRef,
    oldParticipantSnapshot.data()
  );

  // Atualiza todas as allocations
  allocationsSnapshot.docs.forEach(allocationDoc => {
    batch.update(
      allocationDoc.ref,
      {
        participantId: newId,
      }
    );
  });

  // Apaga o documento com ID antigo
  batch.delete(oldParticipantRef);

  await batch.commit();
}

export async function createParticipant(
  name: string
): Promise<string> {
  const participants = await getParticipants();

  const lastOrder =
    participants.length > 0
      ? Math.max(...participants.map(p => p.order))
      : 0;

  const participantData = {
    name: name.trim(),
    token: "",
    level: 0,
    power: 0,
    order: lastOrder + 1000,
    isMember: true,
  };

  const participantRef = await addDoc(
    collection(db, Collections.participants),
    participantData
  );

  return participantRef.id;
}