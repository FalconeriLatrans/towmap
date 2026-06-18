import MapViewport from "./components/Map/MapViewport";
import SearchPanel from "./components/SearchPanel/SearchPanel";
import { useState } from "react";
import "./App.css";

export default function App() {

  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [editingSeat, setEditingSeat] = useState<string | null>(null);

  return (
<div className="app">
  <SearchPanel
    selectedSeat={selectedSeat}
    editingSeat={editingSeat}
    setSelectedSeat={setSelectedSeat}
  />

  <MapViewport
    selectedSeat={selectedSeat}
    setSelectedSeat={setSelectedSeat}
    editingSeat={editingSeat}
    setEditingSeat={setEditingSeat}
  />
</div>
  );
}