import participants from "../data/participants.json";
import { getAllocations } from "./AllocationService";

import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "./Firebase";
import type { Participant } from "../types/Participant";
import { Collections } from "../config/Collections";

export async function getParticipants() {

  const snapshot = await getDocs(collection( db,Collections.participants));

  return snapshot.docs
    .map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))
    .sort( (a,b)=> a.order-b.order) as Participant[];
}

export async function getAvailableParticipants(
    element?: MapElement
): Promise<Participant[]> {

  const allocations = await getAllocations();
  const allocatedNames =
    allocations.map(
      allocation => allocation.participant
    );

  return participants
    .filter(
      participant =>
        !allocatedNames.includes(participant.name)
    )
    .sort(
      (a, b) =>
        b.priority - a.priority
    );
}

export async function subscribeParticipants(
  callback: (participants: Participant[]) => void
) {

  return onSnapshot(
    collection(db,Collections.participants),
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

export async function addParticipant(participant) {
  return console.log("addParticipant");
}

export async function updateParticipant(participant) {
  return console.log("updateParticipant");
}

export async function deleteParticipant(id) {
  return console.log("deleteParticipant");
}

export async function moveParticipant(id, newOrder) {
  return console.log("moveParticipant");
}

export async function generateToken() {
  return console.log("generateToken");
}