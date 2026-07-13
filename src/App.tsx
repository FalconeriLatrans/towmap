import MapViewport from "./components/Map/MapViewport";
import {Environment} from "./config/Environment";
import { importParticipants } from "./services/ParticipantService";
import { migrateAllocations } from "./services/AllocationService";
import SearchPanel from "./components/SearchPanel/SearchPanel";
import InfoPanel from "./components/InfoPanel/InfoPanel";
import { useEffect, useState } from "react";
import type { MapElement } from "./types/MapElement";
import "./App.css";

export default function App() {

  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [selectedOccupant, setSelectedOccupant] = useState("");
  const [editingSeat, setEditingSeat] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState(false);
  const [toast, setToast] = useState("");
  const [selectedElement, setSelectedElement] = useState<MapElement | null>(null);

  useEffect(() => {
    if (!toast)
      return;
    const timer =
      setTimeout(
        () => setToast(""),
        2000
      );
    return () =>
      clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    async function initialize() {
      if (Environment.importParticipants && !Environment.production) {
        await importParticipants();
      }
      if (Environment.migrate && !Environment.production) {
        console.log("Migrando");
        await migrateAllocations();
      }
    }
    initialize();
  }, []);

  return (
    <div className="app">
      <SearchPanel
        setSelectedOccupant={setSelectedOccupant}
        selectedSeat={selectedSeat}
        setSelectedSeat={setSelectedSeat}
        editorMode={editorMode}
        setEditorMode={setEditorMode}
        setToast={setToast}
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
      <InfoPanel
        element={selectedElement}
        occupant={selectedOccupant}
        editorMode={editorMode}
      />
    </div>
  );
}