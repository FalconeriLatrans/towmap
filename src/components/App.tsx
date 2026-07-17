import type { Workspace } from "../types/Workspace";
import {Environment} from "../config/Environment";
import { importParticipants } from "../services/ParticipantService";
import { migrateAllocations } from "../services/AllocationService";
import ParticipantsWorkspace from "./ParticipantsWorkspace/ParticipantsWorkspace";
import MapWorkspace from "./MapWorkspace/MapWorkspace";
import { useEffect, useState } from "react";
import "./App.css";

export default function App() {

const [toast, setToast] = useState("");
  
//App novo
//  const [workspace, setWorkspace] =  useState<Workspace>("map");

  const [workspace] = useState("map"); //Participants

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
    <div className="app">{
        workspace === "map"
        ? (<MapWorkspace

            />)
        : (<ParticipantsWorkspace 
        
        />)
      }</div>
  );

/* App antigo
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
      <TopBar
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
      <ElementPropertiesPanel
        element={selectedElement}
        occupant={selectedOccupant}
        editorMode={editorMode}
      />
    </div>
  );
*/

}