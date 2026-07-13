import "./Element.css";
import "./Seat/Seat";
import type {MapElement} from "../MapElement";

type Props = {
  element: MapElement;
  occupant?: string;
  selected?: boolean;
  editing?: boolean;
  onClick?: (id: string) => void;
};

export default function Seat({
  element,
  occupant,
  selected,
  editing,
  onClick,
}: SeatProps) {

  const isSeat = element.type === "seat";
  const text = isSeat ? (occupant || element.label) : element.label;

  return (
    <div className={`map-element ${element.type}
    ${selected ? " selected" : ""}
    ${editing ? " editing" : ""}`}
      style={{ backgroundColor: element.color }}
      onClick={() => onClick?.(element.id)}
    >
      {text}
    </div>
  );
}