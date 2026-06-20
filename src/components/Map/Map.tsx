import elements from "../../data/mapelements.json";
import ElementRenderer from "../ElementRenderer";
import "./Map.css";
import { subscribeAllocations } from "../../services/AllocationService";
import { useEffect, useState } from "react";

type Props = {
  selectedSeat: string | null;
  setSelectedSeat: (seat: string | null) => void;
  editingSeat: string | null;
  setEditingSeat: (seat: string | null) => void;
  editorMode: boolean;
};


export default function Map({
  selectedSeat,
  setSelectedSeat,
  editingSeat,
  setEditingSeat,
  editorMode,
}: Props) {

  const [allocations, setAllocations] = useState<
    Record<string, string>
  >({});

  const minX = Math.min(...elements.map((e) => e.x));
  const minY = Math.min(...elements.map((e) => e.y));
  const maxX = Math.max(...elements.map((e) => e.x + e.width));
  const maxY = Math.max(...elements.map((e) => e.y + e.height));

  useEffect(() => {
    const unsubscribe =
      subscribeAllocations(
        allocations => {
          const map:
            Record<string, string>
            = {};
          allocations.forEach(
            allocation => { map[allocation.seat] = allocation.participant; }
          );
          setAllocations(map);
        }
      );
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!selectedSeat)
      return;
    const element =
      document.getElementById(`seat-${selectedSeat}`);
    element?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }, [selectedSeat]);

  function handleSeatClick(seat: string) {
    
    if (
      editorMode &&
      selectedSeat === seat
    ) { setEditingSeat(seat);} 
    else {
      setSelectedSeat(seat);
      setEditingSeat(null);
    }
  }

  return (
    <div className="map-container">
      <div
        className="map"
        style={{
          gridTemplateColumns: `repeat(${maxX - minX + 3}, 40px)`,
          gridTemplateRows: `repeat(${maxY - minY + 3}, 40px)`,
          gap: "4px",
          padding: "20px",
        }}
      >
        {elements.map((element) => (<div
          id={
            element.type === "seat" && element.seat
              ? `seat-${element.seat}`
              : undefined
          }
          key={element.id}
          style={{
            gridColumn:
              `${element.x - minX + 1}
       / span ${element.width}`,

            gridRow:
              `${element.y - minY + 1}
       / span ${element.height}`,
          }}
        >
          <ElementRenderer
            element={element}
            occupant={
              element.type === "seat" && element.seat
                ? allocations[element.seat]
                : undefined
            }
            selected={
              element.type === "seat" &&
              selectedSeat === element.seat
            }
            editing={
              element.type === "seat" &&
              editingSeat === element.seat
            }
            onClick={
              element.type === "seat"
                ? handleSeatClick
                : undefined
            }
          />
        </div>
        ))}
      </div>
    </div>
  );
}