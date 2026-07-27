import TopBar from "../TopBar/TopBar";
import MapViewport from "./Map/MapViewport";
import ElementPropertiesPanel from "./ElementPropertiesPanel/ElementPropertiesPanel";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { MapElement } from "../../types/MapElement";
import "./MapWorkspace.css";
import { subscribeAllocations } from "../../services/AllocationService";
import { subscribeParticipants } from "../../services/ParticipantService";
import { sha256 } from "../../services/hash";
import type { Workspace } from "../../types/Workspace";
import type { Allocation } from "../../types/Allocation";
import type { Participant } from "../../types/Participant";
import ParticipantSearch from "./ParticipantSearch/ParticipantSearch";

type Props = {
    setWorkspace: Dispatch<SetStateAction<Workspace>>;
    editorMode: boolean;
    setEditorMode: Dispatch<SetStateAction<boolean>>;
};

export default function MapWorkspace({
    setWorkspace,
    editorMode,
    setEditorMode,
}: Props) {

    const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
    const [selectedOccupant, setSelectedOccupant] = useState("");
    const [editingSeat, setEditingSeat] = useState<string | null>(null);
    const [toast, setToast] = useState("");
    const [selectedElement, setSelectedElement] = useState<MapElement | null>(null);

    const [allocations, setAllocations] = useState<Allocation[]>([]);
    const [participants, setParticipants] = useState<Participant[]>([]);

    const participantsById = Object.fromEntries(participants.map(p => [p.id, p]));
    const allocation = allocations.find(a => a.seat === selectedSeat);
    const occupant = participantsById[allocation?.participantId ?? ""]?.name ?? "";

    const center = (
        <ParticipantSearch
            participants={participants.filter(
                participant => participant.isMember
            )}
            onSelect={handleParticipantSelect}
        />
    );

    const actions = (
        <div className="top-bar-actions">

            {editorMode && (
                <button
                    className="workspace-button"
                    onClick={() => setWorkspace("participants")}
                >
                    👥
                </button>
            )}

            <button
                className="lock-button"
                onClick={async () => {
                    if (editorMode) {
                        setEditorMode(false);
                    } else {
                        const password = prompt("Editor password");
                        const hash = await sha256(password?.trim() ?? "");

                        if (
                            hash ===
                            "71b4354a60c9f304ae9099650b537a63d3f10625873584be2580ef8da5c96361"
                        ) {
                            setEditorMode(true);
                            setToast("🔓 Editor mode enabled");
                        } else {
                            setToast("❌ Invalid password");
                        }
                    }
                }}
            >
                {editorMode ? "⚙" : "🔒"}
            </button>

        </div>
    );

    useEffect(() => {
        return subscribeAllocations(setAllocations);
    }, []);

    useEffect(() => {
        return subscribeParticipants(setParticipants);
    }, []);

    useEffect(() => {
        setSelectedOccupant(occupant);
    }, [occupant]);

    useEffect(() => {
        if (!toast)
            return;
        const timer = setTimeout(() => setToast(""), 2000);
        return () =>
            clearTimeout(timer);
    }, [toast]);

    function handleParticipantSelect( participantId: string ) {

        const participantAllocation = allocations.find(allocation => allocation.participantId === participantId);

        if (!participantAllocation) {
            setToast("Participant has no assigned seat");
            return;
        }

        setSelectedSeat(participantAllocation.seat);
    }

    return (
        <div className="app">
            {
                <>
                    <TopBar
                        title="TOW Map"
                        center={center}
                        actions={actions}
                    />
                    {toast && (
                        <div className="toast">
                            {toast}
                        </div>
                    )}
                    <MapViewport
                        selectedSeat={selectedSeat}
                        setSelectedSeat={setSelectedSeat}
                        editingSeat={editingSeat}
                        setEditingSeat={setEditingSeat}
                        editorMode={editorMode}
                        setSelectedElement={setSelectedElement}
                    />
                    <ElementPropertiesPanel
                        element={selectedElement}
                        occupant={selectedOccupant}
                        editorMode={editorMode}
                    />
                </>
            }
        </div>
    );
}