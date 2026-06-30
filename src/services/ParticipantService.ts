import participants from "../data/participants.json";
import { getAllocations } from "./AllocationService";
import type { Participant } from "../types/Participant";

export async function getParticipants(): Promise<Participant[]> {
  return [...participants];
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