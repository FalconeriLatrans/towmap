import seats from "../data/seats.json";
import Seat from "./Seat";
import {
  TransformWrapper,
  TransformComponent,
} from "react-zoom-pan-pinch";


export default function Map() {

  //    alert("Map executou");
  console.log(seats[0]);

  const minX = Math.min(...seats.map((s) => s.x));
  const minY = Math.min(...seats.map((s) => s.y));

  const maxX = Math.max(...seats.map((s) => s.x));
  const maxY = Math.max(...seats.map((s) => s.y));

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#d7ead3",
        overflow: "hidden",
      }}
    >
      <TransformWrapper
        initialScale={.5}
        minScale={0.2}
        maxScale={8}
        centerOnInit
        limitToBounds={false}
        smooth={true}
      >
        <TransformComponent>
          wrapperStyle={{
            width: "100%",
            height: "100%",
          }}
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
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}