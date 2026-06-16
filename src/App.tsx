import MapViewport from "./components/Map/MapViewport";
import SearchPanel from "./components/SearchPanel/SearchPanel";
import { allocate } from "./services/AllocationService";

export default function App() {

  return (
    <>
      <button
        onClick={() =>
          allocate(
            "B1 101",
            "João"
          )
        }
      >
        TESTAR ALOCAÇÃO
      </button>

      <SearchPanel />
      <MapViewport />
    </>
  );
}

/*
export default function App() {
  return (
    <div className="app">
      <SearchPanel />
      <MapViewport />
    </div>
  );
}
*/