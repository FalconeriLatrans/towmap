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
import PlayerAccess from "./PlayerAccess/PlayerAccess";
import loadElements from "../../services/loadElements";
import { simulateAllocationEvent } from "../../services/AllocationEventService";
import AdminTools from "./AdminTools/AdminTools";

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

    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [selectedOccupant, setSelectedOccupant] = useState("");
    const [editingCity, setEditingCity] = useState<string | null>(null);
    const [toast, setToast] = useState("");
    const [selectedElement, setSelectedElement] = useState<MapElement | null>(null);
    const [playerId, setPlayerId] = useState<string | null>(() => localStorage.getItem("towmap_player_id"));

    const [allocations, setAllocations] = useState<Allocation[]>([]);
    const [participants, setParticipants] = useState<Participant[]>([]);

    const participantsById = Object.fromEntries(participants.map(p => [p.id, p]));
    const allocation = allocations.find(a => a.city === selectedCity);
    const occupant = participantsById[allocation?.participantId ?? ""]?.name ?? "";
    const player = participantsById[playerId ?? ""] ?? null;
    const cityIds = loadElements().filter(element => element.type === "city").map(element => element.id);
    const blockedCities = new Set(Object.keys(player ? simulateAllocationEvent(participants.filter(p => p.isMember && p.order < player.order), cityIds).assignments : {}));

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

            {player ? (
                <PlayerAccess
                    player={player}
                    onLogin={() => undefined}
                    onLogout={() => { localStorage.removeItem("towmap_player_id"); setPlayerId(null); }}
                    onError={setToast}
                />
            ) : (
                <PlayerAccess
                    player={null}
                    onLogin={id => { localStorage.setItem("towmap_player_id", id); setPlayerId(id); }}
                    onLogout={() => undefined}
                    onError={setToast}
                />
            )}

            {editorMode && (
                <button
                    className="workspace-button"
                    onClick={() => setWorkspace("participants")}
                >
                    👥
                </button>
            )}

            {editorMode ? <AdminTools onLogout={() => { if (window.confirm("Leave administrator mode?")) setEditorMode(false); }} /> : <button className="lock-button" onClick={async () => {
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
                    }} >🔒</button>}

        </div>
    );

    useEffect(() => {
        return subscribeAllocations(setAllocations);
    }, []);

    useEffect(() => {
        return subscribeParticipants(setParticipants);
    }, []);

    useEffect(() => {
        // The selected city is controlled by the map, while its occupant is live Firestore data.
        // eslint-disable-next-line react-hooks/set-state-in-effect
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
            setToast("Participant has no assigned spot");
            return;
        }

        setSelectedCity(participantAllocation.city);
        setSelectedElement(loadElements().find(element => element.id === participantAllocation.city) ?? null);
    }

    return (
        <div className="app">
            {
                <>
                    <TopBar
                        title={player ? (
                            <button className="player-title" onClick={() => handleParticipantSelect(player.id)}>{player.name}</button>
                        ) : "TOW Map"}
                        center={center}
                        actions={actions}
                    />
                    {toast && (
                        <div className="toast">
                            {toast}
                        </div>
                    )}
                    <MapViewport
                        selectedCity={selectedCity}
                        setSelectedCity={setSelectedCity}
                        editingCity={editingCity}
                        setEditingCity={setEditingCity}
                        editorMode={editorMode}
                        setSelectedElement={setSelectedElement}
                        player={player}
                        blockedCities={blockedCities}
                    />
                    <ElementPropertiesPanel
                        element={selectedElement}
                        occupant={selectedOccupant}
                        editorMode={editorMode}
                        player={player}
                        participants={participants}
                    />
                </>
            }
        </div>
    );
}
