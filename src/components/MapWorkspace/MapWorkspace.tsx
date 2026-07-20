import TopBar from "../TopBar/TopBar";
import MapViewport from "./Map/MapViewport";
import ElementPropertiesPanel from "./ElementPropertiesPanel/ElementPropertiesPanel";
import { useEffect, useState } from "react";
import type { MapElement } from "./types/MapElement";
import "./MapWorkspace.css";
import Dropdown from "../Dropdown/Dropdown";
import type { DropdownItem } from "../Dropdown/Dropdown";
import { subscribeAllocations, getAllocations } from "../../services/AllocationService";
import { subscribeParticipants } from "../../services/ParticipantService";
import { sha256 } from "../../services/hash";

type Props = {
    setWorkspace: Dispatch<SetStateAction<Workspace>>;
};

export default function MapWorkspace({
    setWorkspace,
}: Props) {

    const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
    const [selectedOccupant, setSelectedOccupant] = useState("");
    const [editingSeat, setEditingSeat] = useState<string | null>(null);
    const [editorMode, setEditorMode] = useState(false);
    const [toast, setToast] = useState("");
    const [selectedElement, setSelectedElement] = useState<MapElement | null>(null);

    const [showParticipants, setShowParticipants] = useState(false);
    const [allocations, setAllocations] = useState<Allocation[]>([]);
    const [participants, setParticipants] = useState<Participant[]>([]);

    const participantsById = Object.fromEntries(participants.map(p => [p.id, p]));
    const participantSeats = Object.fromEntries(allocations.map(a => [a.participantId, a.seat]));
    const allocation = allocations.find(a => a.seat === selectedSeat);
    const occupant = participantsById[allocation?.participantId ?? ""]?.name ?? "";
    const sortedParticipants = [...participants]
        .filter(p => p.isMember)
        .sort((a, b) => a.name.localeCompare(b.name));

    const items: DropdownItem[] = sortedParticipants.map(participant => {
        const allocated = Boolean(participantSeats[participant.id]);
        return {
            id: participant.id,
            content: (
                <>
                    {allocated ? "✓" : "○"}{" "}
                    {participant.name}
                </>
            ),
        };
    });
    const actions = (
        <button
            className="lock-button"
            onClick={async () => {
                if (editorMode) {
                    setEditorMode(false);
                } else {
                    const password = prompt("Editor password");
                    const hash = await sha256(password?.trim() ?? "");
                    if (hash === "71b4354a60c9f304ae9099650b537a63d3f10625873584be2580ef8da5c96361") {
                        setEditorMode(true);
                        setToast("🔓 Editor mode enabled");
                    } else {
                        setToast("❌ Invalid password");
                    }
                }
            }}
        > {editorMode ? "⚙" : "🔒"}
        </button >
    );

    const center = (
        <Dropdown
            button={
                <>
                    🔍 {occupant || "Select player"}
                    <span>
                        {showParticipants ? "▲" : "▼"}
                    </span>
                </>
            }
            open={showParticipants}
            items={items}
            selectedId={occupant}
            onToggle={() =>
                setShowParticipants(
                    !showParticipants
                )
            }
            onSelect={id => {
                const seat = participantSeats[id];
                const name = participantsById[id]?.name;

                if (seat) {
                    setSelectedSeat(seat);
                } else {
                    setToast(
                        `${name} has not been assigned to a spot yet.`
                    );
                }
                setShowParticipants(false);
            }}
        />
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
        setShowParticipants(false);
    }, [selectedSeat]);

    useEffect(() => {
        if (!toast)
            return;
        const timer = setTimeout(() => setToast(""), 2000);
        return () =>
            clearTimeout(timer);
    }, [toast]);

    return (
        <div className="app">
            {
                <>
                    <TopBar
                        title="TOW Map"
                        center={center}
                        actions={actions}
/*
                        setSelectedOccupant={setSelectedOccupant}
                        selectedSeat={selectedSeat}
                        setSelectedSeat={setSelectedSeat}
                        editorMode={editorMode}
                        setEditorMode={setEditorMode}
                        setToast={setToast}
                        */
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