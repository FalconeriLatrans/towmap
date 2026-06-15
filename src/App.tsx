import Map from "./components/Map/Map";
import SearchPanel from "./components/SearchPanel/SearchPanel";

export default function App() {
  return (
    <div className="app">
      <SearchPanel />
      <Map />
    </div>
  );
}