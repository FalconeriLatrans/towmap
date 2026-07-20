import TopBar from "../TopBar/TopBar";
import ParticipantsList from "./ParticipantsList/ParticipantsList";
import ParticipantPropertiesPanel from "./ParticipantPropertiesPanel/ParticipantPropertiesPanel";
import { useEffect, useState } from "react";
import type { MapElement } from "./types/MapElement";
import "./ParticipantsWorkspace.css";

export default function ParticipantsWorkspace() {

    const [filter, setFilter] = useState("");
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

    return (

        <>
            <TopBar
                title="TOW Members"
                searchButton="calma"
                actions="ja vai"
            />
            <ParticipantsList
                participants={participants}
                filter={filter}
                selectedParticipant={selectedParticipant}
                setSelectedParticipant={setSelectedParticipant}
            />
            <ParticipantPropertiesPanel
                participant={selectedParticipant}
            />

        </>

    );

}