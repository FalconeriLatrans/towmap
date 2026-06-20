import MapViewport from "./components/Map/MapViewport";
import SearchPanel from "./components/SearchPanel/SearchPanel";
import InfoPanel from "./components/InfoPanel/InfoPanel";
import { useState } from "react";
import "./App.css";

export default function App() {

  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [selectedOccupant, setSelectedOccupant] = useState("");
  const [editingSeat, setEditingSeat] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState(false);
//  const [setShowParticipants] = useState(false);
 
  return (
    <div className="app">
      <SearchPanel
        setSelectedOccupant={setSelectedOccupant}
        selectedSeat={selectedSeat}
        editingSeat={editingSeat}
        setEditingSeat={setEditingSeat}
        setSelectedSeat={setSelectedSeat}
        editorMode={editorMode}
        setEditorMode={setEditorMode}
      />
      <MapViewport
        selectedSeat={selectedSeat}
        setSelectedSeat={setSelectedSeat}
        editingSeat={editingSeat}
        setEditingSeat={setEditingSeat}
        editorMode={editorMode}
      />
      <InfoPanel
        seat={selectedSeat}
        occupant={selectedOccupant}
      />
    </div>
  );
}