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

  type ParticipantsView = "active" | "trash";

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<ParticipantsView>("active");
  const selectedParticipant = participants.find(p => p.id === selectedId) ?? null;
  const visibleParticipants =
    view === "active"
      ? participants.filter(p => p.isMember)
      : participants.filter(p => !p.isMember);

  useEffect(() => {
    return subscribeParticipants(setParticipants);
  }, []);

  const activeActions = (
    <div className="top-bar-actions">
      <button
        className="trash-button"
        onClick={() => {
          setView("trash");
          setSelectedId(null);
        }}
      >
        🗑
      </button>
      <button
        className="workspace-button"
        onClick={() => setWorkspace("map")}
      >
        🗺
      </button>
    </div>
  );

  const trashActions = (
    <div className="top-bar-actions">
      <button
        className="back-button"
        onClick={() => {
          setView("active");
          setSelectedId(null);
        }}
      >
        ↩
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
        title={
          view === "active"
            ? "TOW Members"
            : "Removed Members"
        }
        actions={
          view === "active"
            ? activeActions
            : trashActions
        }
      />
      <ParticipantsList
        participants={visibleParticipants}
        mode={view}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <ParticipantPropertiesPanel
        participant={selectedParticipant}
        onArchived={() => setSelectedId(null)}
      />

    </>

  );

}