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
  doc,
  deleteDoc,
  updateDoc,
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
    } as Participant))
    .sort((a, b) => a.order - b.order);

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
    } as Participant))
    .sort((a, b) => a.order - b.order);

callback(participants);
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

export async function deleteParticipant(id: string) {
  await deleteDoc(
    doc(
      db,
      Collections.participants,
      id
    )
  );
  return console.log("deleteParticipant");
}

export async function moveParticipant(
  participantId: string,
  previousParticipant: Participant | null,
  nextParticipant: Participant | null
) {

  // Movido para o início
  if (!previousParticipant && nextParticipant) {
    await updateDoc(
      doc(
        db,
        Collections.participants,
        participantId
      ),
      {
        order: nextParticipant.order - 1000
      }
    );

    return;
  }


  // Movido para o final
  if (previousParticipant && !nextParticipant) {
    await updateDoc(
      doc(
        db,
        Collections.participants,
        participantId
      ),
      {
        order: previousParticipant.order + 1000
      }
    );
    return;
  }


  // Movido entre dois participantes
  if (previousParticipant && nextParticipant) {

    const gap = nextParticipant.order - previousParticipant.order;

    if (gap > 1) {

      const newOrder = Math.floor((previousParticipant.order + nextParticipant.order) / 2);

      await updateDoc(
        doc(
          db,
          Collections.participants,
          participantId
        ),
        {
          order: newOrder
        }
      );

      return;
    }


    // Acabaram os inteiros disponíveis.
    // Hora da faxina.
    await normalizeParticipantOrder();

    const normalizedParticipants = await getParticipants();
    const normalizedPrevious = normalizedParticipants.find(p => p.id === previousParticipant.id);
    const normalizedNext = normalizedParticipants.find(p => p.id === nextParticipant.id);

    if (!normalizedPrevious || !normalizedNext) {
      throw new Error(
        "Could not find participants after order normalization."
      );
    }

    const newOrder = Math.floor(
      (normalizedPrevious.order + normalizedNext.order) / 2);

    await updateDoc(
      doc(
        db,
        Collections.participants,
        participantId
      ),
      {
        order: newOrder
      }
    );
  }
}

async function normalizeParticipantOrder() {

  const participants = await getParticipants();
  const batch = writeBatch(db);

  participants.forEach(
    (participant, index) => {
      batch.update(
        doc(
          db,
          Collections.participants,
          participant.id
        ),
        {
          order: (index + 1) * 1000
        }
      );
    }
  );

  await batch.commit();
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

  const id = `tmp_${crypto.randomUUID()}`;

  const participantData = {
    name: name.trim(),
    token: "",
    level: 0,
    power: 0,
    order: lastOrder + 1000,
    isMember: true,
  };

  const participantRef = doc(
    db,
    Collections.participants,
    id
  );

  await setDoc(
    participantRef,
    participantData
  );

  return id;
}

export async function archiveParticipant(
  id: string
) {
  const participantRef = doc(
    db,
    Collections.participants,
    id
  );

  await updateDoc(
    participantRef,
    {
      isMember: false,
    }
  );
}

export async function restoreParticipant(
  id: string
) {
  const participantRef = doc(
    db,
    Collections.participants,
    id
  );

  await updateDoc(
    participantRef,
    {
      isMember: true,
    }
  );
}

export async function permanentlyDeleteParticipant(
  participantId: string
) {

  const participantRef = doc(
    db,
    Collections.participants,
    participantId
  );

  const participantSnapshot =
    await getDoc(participantRef);

  if (!participantSnapshot.exists()) {
    throw new Error("PARTICIPANT_NOT_FOUND");
  }

  if (participantSnapshot.data().isMember) {
    throw new Error("PARTICIPANT_IS_ACTIVE");
  }
  const allocationsQuery = query(
    collection(db, Collections.allocations),
    where("participantId", "==", participantId)
  );

  const allocationsSnapshot = await getDocs(allocationsQuery);

  if (!allocationsSnapshot.empty) {
    const allocation =
      allocationsSnapshot.docs[0].data();

    throw new Error(
      `PARTICIPANT_HAS_ALLOCATION:${allocation.seatLabel ?? ""}`
    );
  }

  await deleteDoc(
    doc(
      db,
      Collections.participants,
      participantId
    )
  );
}