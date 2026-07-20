import TopBar from "../TopBar/TopBar";
import ParticipantsList from "./ParticipantsList/ParticipantsList";
import ParticipantPropertiesPanel from "./ParticipantPropertiesPanel/ParticipantPropertiesPanel";
import { useEffect, useState } from "react";
import type { MapElement } from "./types/MapElement";
import "./ParticipantsWorkspace.css";

export default function ParticipantsWorkspace() {


    const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
    const [selectedOccupant, setSelectedOccupant] = useState("");
    const [editingSeat, setEditingSeat] = useState<string | null>(null);
    const [editorMode, setEditorMode] = useState(false);
    const [toast, setToast] = useState("");
    const [selectedElement, setSelectedElement] = useState<MapElement | null>(null);

    const [filter, setFilter] = useState("");
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

    return (

        <>
            <TopBar
                setSelectedOccupant={setSelectedOccupant}
                selectedSeat={selectedSeat}
                setSelectedSeat={setSelectedSeat}
                editorMode={editorMode}
                setEditorMode={setEditorMode}
                setToast={setToast}
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