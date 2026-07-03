import "./Seat.css";
import "../Element.css";

type SeatProps = {
  id: string;
  label: string;
  color: string;
  occupant?: string;
  selected?: boolean;
  editing?: boolean;
  onClick?: (seat: string) => void;
};

export default function Seat({
  id,
  label,
  color,
  occupant,
  selected,
  editing,
  onClick,
}: SeatProps) {

  return (
    <div
      className={`map-element seat
        ${selected ? "selected" : ""}
        ${editing ? "editing" : ""}
      `}
      onClick={() => onClick?.(id)}
      style={{ backgroundColor: color }}
    >
      {occupant || label}
    </div>
  );
}