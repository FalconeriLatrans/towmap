import seats from "../../data/seats.json";
import Seat from "../Elements/Seat/Seat";
import SeatAllocationModal from "../SeatAllocationModal/SeatAllocationModal";
import "./Map.css";
import { useState } from "react";

export default function Map({
  selectedSeat,
  setSelectedSeat,
  editingSeat,
  setEditingSeat,
}: Props) {

  const minX = Math.min(...seats.map((s) => s.x));
  const minY = Math.min(...seats.map((s) => s.y));

  const maxX = Math.max(...seats.map((s) => s.x));
  const maxY = Math.max(...seats.map((s) => s.y));

  type Props = {
    selectedSeat: string | null;
    setSelectedSeat: (
      seat: string | null
    ) => void;
  
    editingSeat: string | null;
    setEditingSeat: (
      seat: string | null
    ) => void;
  };

  //const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  //const [editingSeat, setEditingSeat] =   useState<string | null>(null);

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
            key={seat.seat}
            style={{
              gridColumn: `${seat.x - minX + 1} / span ${seat.width}`,
              gridRow: `${seat.y - minY + 1} / span ${seat.height}`,
            }}
          >
            <Seat
              seat={seat.seat}
              selected={selectedSeat === seat.seat}
              editing={editingSeat === seat.seat}
              onClick={(seat) => {
                if (selectedSeat === seat) {
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
      {selectedSeat && (
        <SeatAllocationModal
          seat={selectedSeat}
          onClose={() => setSelectedSeat(null)}
        />
      )}
    </div>
  );
}