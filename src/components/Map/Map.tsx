import seats from "../../data/seats.json";
import Seat from "../Elements/Seat/Seat";
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

  const minX = Math.min(...seats.map((s) => s.x));
  const minY = Math.min(...seats.map((s) => s.y));

  const maxX = Math.max(...seats.map((s) => s.x));
  const maxY = Math.max(...seats.map((s) => s.y));

  useEffect(() => {
    const unsubscribe =
      subscribeAllocations(
        allocations => {
          const map:
            Record<string, string>
            = {};
          allocations.forEach(
            allocation => {
              map[
                allocation.seat
              ] =
                allocation.participant;
            }
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
      document.getElementById(
        `seat-${selectedSeat}`
      );
    element?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }, [selectedSeat]);

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
        {seats.map((seat) => (
          <div
            id={`seat-${seat.seat}`}
            key={seat.seat}
            style={{
              gridColumn: `${seat.x - minX + 1} / span ${seat.width}`,
              gridRow: `${seat.y - minY + 1} / span ${seat.height}`,
            }}
          >
            <Seat
              seat={seat.seat}
              occupant={
                allocations[
                seat.seat
                ]
              }
              selected={selectedSeat === seat.seat}
              editing={editingSeat === seat.seat}
              onClick={(seat) => {
                if (
                  editorMode &&
                  selectedSeat === seat
                ) {
                  setEditingSeat(seat);
                } else {
                  setSelectedSeat(seat);
                  setEditingSeat(null);
                }
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}