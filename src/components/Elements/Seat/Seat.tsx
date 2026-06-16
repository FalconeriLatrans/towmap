import "./Seat.css";

type SeatProps = {
  seat: string;
  occupant?: string;
  selected?: boolean;
  editing?: boolean;
  onClick?: (seat: string) => void;
};

export default function Seat({
  seat,
  occupant,
  selected,
  editing,
  onClick,
}: SeatProps) {

  const seatNumber =
    parseInt(
      seat.split(" ")[1]
    );

  const category =
    Math.floor(
      seatNumber / 100
    );

  const colors: Record<number, string> = {
    1: "#2d5fb8",
    2: "#7c95b6",
    3: "#d0d4da",
    4: "#efe4c3",
  };

  return (
    <div
      className={`seat
        ${selected ? "selected" : ""}
        ${editing ? "editing" : ""}
      `}
      onClick={() => onClick?.(seat)}
      style={{
        backgroundColor:
          colors[category] || "#ffffff",
      }}
    >
      {occupant || seat}
    </div>
  );
}