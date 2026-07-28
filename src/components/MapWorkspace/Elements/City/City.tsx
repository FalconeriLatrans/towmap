import "../Element.css";
import "./City.css";

import type { MapElement } from "../../../../types/MapElement";

type Props = {
  element: MapElement;
  occupant?: string;
  selected?: boolean;
  editing?: boolean;
  onClick?: (id: string) => void;
};

export default function City({
  element,
  occupant,
  selected,
  editing,
  onClick,
}: Props) {
  return (
    <div
      className={
        "map-element city" +
        (selected ? " selected" : "") +
        (editing ? " editing" : "")
      }
      style={{
        backgroundColor: element.color,
      }}
      onClick={() => onClick?.(element.id)}
    >
      {occupant}
    </div>
  );
}