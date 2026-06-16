import MapViewport from "./components/Map/MapViewport";
import SearchPanel from "./components/SearchPanel/SearchPanel";
import { allocate } from "./services/AllocationService";
import { useState } from "react";

export default function App() {

  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [editingSeat, setEditingSeat] = useState<string | null>(null);

  return (
<>
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
</>
  );
}