import TopBar from "../TopBar/TopBar";
import ParticipantsList from "./ParticipantsList/ParticipantsList";
import ParticipantPropertiesPanel from "./ParticipantPropertiesPanel/ParticipantPropertiesPanel";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import "./ParticipantsWorkspace.css";
import { subscribeParticipants, createParticipant } from "../../services/ParticipantService";
import type { Workspace } from "../../types/Workspace";
import type { Participant } from "../../types/Participant";

type Props = {
  setWorkspace: Dispatch<SetStateAction<Workspace>>;
};

export default function ParticipantsWorkspace({
  setWorkspace,
}: Props) {

  const [participants, setParticipants] =  useState<Participant[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedParticipant = participants.find(p => p.id === selectedId) ?? null;

  useEffect(() => {
    return subscribeParticipants(setParticipants);
  }, []);
  
const actions = (
  <div className="top-bar-actions">
    <button
      className="add-participant-button"
      onClick={handleAddParticipant}
    >
      + Add
    </button>
    <button
      className="workspace-button"
      onClick={() => setWorkspace("map")}
    >
      🗺
    </button>
  </div>
);

async function handleAddParticipant() {
  const name = prompt("Participant name");
  if (!name?.trim()) return;
  try {
    const id = await createParticipant(
      name.trim()
    );
    setSelectedId(id);
  } catch (error) {
    console.error(
      "Error creating participant:",
      error
    );
  }
}
    return (


        <>
            <TopBar
                title="TOW Members"
                actions={actions}
            />
            <ParticipantsList
                participants={participants}
                selectedId={selectedId}
                onSelect={setSelectedId}
            />
            <ParticipantPropertiesPanel
                participant={selectedParticipant}
            />

        </>

    );

}