import seats from "../data/seats.json";
import Seat from "./Seat";

export default function Map() {
  const minX = Math.min(...seats.map((s) => s.x));
  const minY = Math.min(...seats.map((s) => s.y));

  const maxX = Math.max(...seats.map((s) => s.x));
  const maxY = Math.max(...seats.map((s) => s.y));

  return (
    <div
      className="map"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${maxX - minX + 3}, 70px)`,
        gridTemplateRows: `repeat(${maxY - minY + 3}, 70px)`,
        gap: "4px",
        padding: "20px",
      }}
    >
      {seats.map((seat) => (
        <div
          key={seat.seat}
          style={{
            gridColumn: seat.x - minX + 1,
            gridRow: seat.y - minY + 1,
          }}
        >
          <Seat seat={seat.seat} />
        </div>
      ))}
    </div>
  );
}