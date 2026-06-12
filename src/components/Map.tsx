import seats from "../data/seats.json";
import Seat from "./Seat";

export default function Map() {
    
//    alert("Map executou");
    console.log(seats[0]);

  const minX = Math.min(...seats.map((s) => s.x));
  const minY = Math.min(...seats.map((s) => s.y));

  const maxX = Math.max(...seats.map((s) => s.x));
  const maxY = Math.max(...seats.map((s) => s.y));

  return (
    <div
      className="map"
      style={{
        display: "grid",
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
          <Seat seat={seat.seat} />
        </div>
      ))}
    </div>
  );
}