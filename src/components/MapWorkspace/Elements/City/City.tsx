import "../Element.css";
import "./City.css";

import type { MapElement } from "../../../../types/MapElement";

export type CityStatus =
  | "available"
  | "occupied"
  | "former-member";

type Props = {
  element: MapElement;
  occupant?: string;
  status: CityStatus;
  selected?: boolean;
  editing?: boolean;
  onClick?: (id: string) => void;
  preference?: number;
  dimmed?: boolean;
};

export default function City({
  element,
  occupant,
  status,
  selected,
  editing,
  onClick,
  preference,
  dimmed,
}: Props) {
  return (
    <div
      className={
        `map-element city ${status}` +
        (selected ? " selected" : "") +
        (editing ? " editing" : "") + (dimmed ? " dimmed" : "")
      }
      style={{
        backgroundColor: element.color,
      }}
      onClick={() => onClick?.(element.id)}
    >
      {occupant}
      {preference && <span className="map-medallion">{preference}</span>}
    </div>
  );
}
