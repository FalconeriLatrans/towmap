import Element from "../Elements/Element";
import type { MapElement } from "../../../types/MapElement";
import "./Map.css";
import { subscribeAllocations } from "../../../services/AllocationService";
import { subscribeParticipants } from "../../../services/ParticipantService";
import loadElements from "../../../services/loadElements";
import { useEffect, useState } from "react";
import type { Participant } from "../../../types/Participant";
import type { CityStatus } from "../Elements/City/City";
//import type { Dispatch, SetStateAction } from "react";

type Props = {
  selectedCity: string | null;
  setSelectedCity: (city: string | null) => void;
  editingCity: string | null;
  setEditingCity: (city: string | null) => void;
  editorMode: boolean;
  setSelectedElement: React.Dispatch<React.SetStateAction<MapElement | null>>;
};

export default function Map({
  selectedCity: selectedCity,
  setSelectedCity: setSelectedCity,
  editingCity: editingCity,
  setEditingCity: setEditingCity,
  editorMode,
  setSelectedElement,
}: Props) {

  const elements = loadElements();
  const [allocations, setAllocations] = useState<
    Record<string, string>
  >({});
  const [participants, setParticipants] = useState<
    Record<string, Participant>
  >({});

  const minX = Math.min(...elements.map((e) => e.x));
  const minY = Math.min(...elements.map((e) => e.y));
  const maxX = Math.max(...elements.map((e) => e.x + e.width));
  const maxY = Math.max(...elements.map((e) => e.y + e.height));

  useEffect(() => {
    return subscribeParticipants(list => {

      const map: Record<string, Participant> = {};

      list.forEach(participant => {
        map[participant.id] = participant;
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
            allocation => { map[allocation.city] = allocation.participantId; }
          );
          setAllocations(map);
        }
      );
    return unsubscribe;
  }, []);

  function handleElementClick(element: any) {

    if (
      element.type === "city" &&
      editorMode &&
      selectedCity === element.id
    ) {
      setEditingCity(element.id);
      return;
    }
    setSelectedCity(element.id);
    setSelectedElement(element);
    setEditingCity(null);
  }

  return (
    <div className="map-container">
      <div
        className="map"
        style={{
          gridTemplateColumns: `repeat(${maxX - minX + 1}, 40px)`,
          gridTemplateRows: `repeat(${maxY - minY + 3}, 40px)`,
          gap: "4px",
          padding: "20px",
        }}
      >
        {elements.map(element => {

          const isCity = element.type === "city";
          const participantId = allocations[element.id];
          const participant = participantId
              ? participants[participantId]
              : undefined;
          const occupant = participant?.name;

          let cityStatus: CityStatus = "available";

          if (participant) {
            cityStatus = participant.isMember
              ? "occupied"
              : "former-member";
          }

          return (
            <div
              key={element.id}
              id={element.id}
              style={{
                gridColumn: `${element.x - minX + 1} / span ${element.width}`,
                gridRow: `${maxY - element.y - element.height + 1} / span ${element.height}`,
              }}
            >
<Element
  element={element}
  occupant={occupant}
  status={isCity ? cityStatus : undefined}
  selected={selectedCity === element.id}
  editing={
    isCity &&
    editingCity === element.id
  }
  onClick={() =>
    handleElementClick(element)
  }
/>
            </div>
          );
        })}
      </div>
    </div>
  );
}