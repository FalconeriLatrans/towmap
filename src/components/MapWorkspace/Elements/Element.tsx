import "./Element.css";
import type { MapElement } from "../../../types/MapElement";
import City from "./City/City";
import type { CityStatus } from "./City/City";

type Props = {
  element: MapElement;
  occupant?: string;
  status?: CityStatus;
  selected?: boolean;
  editing?: boolean;
  onClick?: (id: string) => void;
};

export default function Element({
  element,
  occupant,
  status,
  selected,
  editing,
  onClick,
}: Props) {

  if (element.type === "city") {
    return (
      <City
        element={element}
        occupant={occupant}
        status={status ?? "available"}
        selected={selected}
        editing={editing}
        onClick={onClick}
      />
    );
  }

  return (
    <div
      className={`map-element ${element.type}`}
      style={{
        backgroundColor: element.color,
      }}
      onClick={() => onClick?.(element.id)}
    >
      {element.label}
    </div>
  );
}