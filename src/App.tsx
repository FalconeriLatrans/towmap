import MapViewport from "./components/Map/MapViewport";
import SearchPanel from "./components/SearchPanel/SearchPanel";
import InfoPanel from "./components/InfoPanel/InfoPanel";
import { useEffect, useState } from "react";
import "./App.css";

export default function App() {

  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [selectedOccupant, setSelectedOccupant] = useState("");
  const [editingSeat, setEditingSeat] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState(false);
  const [toast, setToast] = useState("");
 
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
      />
      <InfoPanel
        seat={selectedSeat}
        occupant={selectedOccupant}
      />
    </div>
  );
}