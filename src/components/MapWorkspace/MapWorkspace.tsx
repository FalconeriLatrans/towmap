import TopBar from "../TopBar/TopBar";
import MapViewport from "./Map/MapViewport";
import ElementPropertiesPanel from "./ElementPropertiesPanel/ElementPropertiesPanel";
import { useEffect, useState } from "react";
import type { MapElement } from "./types/MapElement";
import "./MapWorkspace.css";

type Props = {
    setWorkspace: Dispatch<SetStateAction<Workspace>>;
};

export default function MapWorkspace({
    setWorkspace,
}: Props) {

    const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
    const [selectedOccupant, setSelectedOccupant] = useState("");
    const [editingSeat, setEditingSeat] = useState<string | null>(null);
    const [editorMode, setEditorMode] = useState(false);
    const [toast, setToast] = useState("");
    const [selectedElement, setSelectedElement] = useState<MapElement | null>(null);

    useEffect(() => {
        if (!toast)
            return;
        const timer = setTimeout(() => setToast(""), 2000);
        return () =>
            clearTimeout(timer);
    }, [toast]);

    return (
        <div className="app">
            {
                <>
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
                </>
            }
        </div>
    );
}