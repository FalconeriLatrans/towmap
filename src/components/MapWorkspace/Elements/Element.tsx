import "./Element.css";

import type { MapElement } from "../../../types/MapElement";
import City from "./City/City";

type Props = {
  element: MapElement;
  occupant?: string;
  selected?: boolean;
  editing?: boolean;
  onClick?: (id: string) => void;
};

export default function Element({
  element,
  occupant,
  selected,
  editing,
  onClick,
}: Props) {

  if (element.type === "seat") {
    return (
      <City
        element={element}
        occupant={occupant}
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