import type { Workspace } from "../types/Workspace";
import { Environment } from "../config/Environment";
import { importParticipants } from "../services/ParticipantService";
import { migrateAllocations } from "../services/AllocationService";
import MapWorkspace from "./MapWorkspace/MapWorkspace";
import ParticipantsWorkspace from "./ParticipantsWorkspace/ParticipantsWorkspace";
import { useEffect, useState } from "react";
import "./App.css";

export default function App() {

  const [toast, setToast] = useState("");

  //App novo
    const [workspace, setWorkspace] =  useState<Workspace>("map");

  //const [workspace] = useState("participants"); //participants map

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
  <div className="app">
    {workspace === "map" ? (
      <MapWorkspace
        setWorkspace={setWorkspace}
      />
    ) : (
      <ParticipantsWorkspace
        setWorkspace={setWorkspace}
      />
    )}
  </div>
);
}