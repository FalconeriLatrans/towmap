import TopBar from "../TopBar/TopBar";
import ParticipantsList from "./ParticipantsList/ParticipantsList";
import ParticipantPropertiesPanel from "./ParticipantPropertiesPanel/ParticipantPropertiesPanel";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import "./ParticipantsWorkspace.css";
import { subscribeParticipants } from "../../services/ParticipantService";
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
  <button
    className="workspace-button"
    onClick={() => setWorkspace("map")}
  >
    🗺
  </button>
);

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