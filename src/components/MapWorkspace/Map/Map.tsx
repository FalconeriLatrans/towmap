import Element from "../Elements/Element";
import type { MapElement } from "../../../types/MapElement";
import "./Map.css";
import { subscribeAllocations } from "../../../services/AllocationService";
import { subscribeParticipants } from "../../../services/ParticipantService";
import loadElements from "../../../services/loadElements";
import { useEffect, useState } from "react";
//import type { Dispatch, SetStateAction } from "react";

type Props = {
  selectedSeat: string | null;
  setSelectedSeat: (seat: string | null) => void;
  editingSeat: string | null;
  setEditingSeat: (seat: string | null) => void;
  editorMode: boolean;
  setSelectedElement: React.Dispatch<React.SetStateAction<MapElement | null>>;
};

export default function Map({
  selectedSeat,
  setSelectedSeat,
  editingSeat,
  setEditingSeat,
  editorMode,
  setSelectedElement,
}: Props) {

  const elements = loadElements();
  const [allocations, setAllocations] = useState<
    Record<string, string>
  >({});
  const [participants, setParticipants] = useState<
    Record<string,string>
>({});

  const minX = Math.min(...elements.map((e) => e.x));
  const minY = Math.min(...elements.map((e) => e.y));
  const maxX = Math.max(...elements.map((e) => e.x + e.width));
  const maxY = Math.max(...elements.map((e) => e.y + e.height));

  useEffect(() => {
    return subscribeParticipants(list => {
//      console.log(list);
        const map: Record<string,string> = {};
        list.forEach(p => {
            map[p.id] = p.name;
        });
        setParticipants(map);
    });
}, []);

  useEffect(() => {
    const unsubscribe =
      subscribeAllocations(
        allocations => {
//        console.log(allocations);
          const map:
            Record<string, string>
            = {};
          allocations.forEach(
            allocation => { map[allocation.seat] = allocation.participantId; }
          );
          setAllocations(map);
        }
      );
    return unsubscribe;
  }, []);
/*
  useEffect(() => {
    if (!selectedSeat) return;
    const element = document.getElementById(selectedSeat ?? "");
    element?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }, [selectedSeat]);
*/
  function handleElementClick(element: any) {

    if (
      element.type === "seat" &&
      editorMode &&
      selectedSeat === element.id
    ) {
      setEditingSeat(element.id);
      return;
    }
    setSelectedSeat(element.id);
    setSelectedElement(element);
    setEditingSeat(null);
  }

  return (
    <div className="map-container">
      <div
        className="map"
        style={{
          gridTemplateColumns: `repeat(${maxX - minX + 1}, 40px)`,
          gridTemplateRows: `repeat(${maxY - minY+3}, 40px)`,
          gap: "4px",
          padding: "20px",
        }}
      >
        {elements.map(element => {

          const isSeat = element.type === "seat";
          const participantId = allocations[element.id];
          const occupant = participantId ? participants[participantId] : undefined;

          return (
            <div
              key={element.id}
              id={element.id}
              style={{
                gridColumn: `${element.x - minX + 1} / span ${element.width}`,
                gridRow: `${maxY - element.y - element.height +1} / span ${element.height}`,
              }}
            >
              <Element
                element={element}
                occupant={occupant}
                selected={selectedSeat === element.id}
                editing={isSeat && editingSeat === element.id}
                onClick={() => handleElementClick(element)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}