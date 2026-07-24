import TopBar from "../TopBar/TopBar";
import ParticipantsList from "./ParticipantsList/ParticipantsList";
import ParticipantPropertiesPanel from "./ParticipantPropertiesPanel/ParticipantPropertiesPanel";
import { useEffect, useState } from "react";
import type { MapElement } from "./types/MapElement";
import "./ParticipantsWorkspace.css";
import { subscribeParticipants } from "../../services/ParticipantService";

export default function ParticipantsWorkspace() {

    const [filter, setFilter] = useState("");
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [selectedId, setSelectedId] = useState<Participant | null>(null);
    const selectedParticipant = participants.find(p => p.id === selectedId) ?? null;

    useEffect(() => {
        return subscribeParticipants(setParticipants);
    }, []);

    return (


        <>
            <TopBar
                title="TOW Members"
                searchButton=""
                actions=""
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