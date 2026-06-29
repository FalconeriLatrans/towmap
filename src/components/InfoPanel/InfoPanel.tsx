// src/components/InfoPanel/InfoPanel.tsx
import type { MapElement } from "../../types/MapElement";
import "./InfoPanel.css";

type Props = {
  element: MapElement | null;
  occupant: string;
  editorMode: boolean;
  participants: Participant[];
};

export default function InfoPanel({
  element,
  occupant,
  editorMode,

}: Props) {

  if (!element) {
    return (
      <div className="info-panel">
        <div className="empty-selection">
          Select a player or a spot
        </div>
      </div>
    );
  }

  const title = occupant || element.label || "Empty";
  const occupantName = occupant || "";

  const code = element.type === "seat"
      ? element.label
      : "";

  const coords = `x:${element.x} y:${element.y}`;

  return (
    <div className="info-panel">
      <div className="occupant-name">
        {editorMode && element.type === "seat"
          ? (
            <select>
              <>
                <option value="">
                  Empty
                </option>
                {participants.map(p => (
                  <option
                    key={p.id}
                    value={p.id}
                  >
                    {p.name}
                  </option>
                ))}
              </>
            </select>
          )
          : (
            title
          )}
      </div>
      <div className="info-row">
        <span className="info-label">
          {code}
        </span>
        <span className="info-value">
          {coords}
        </span>
      </div>
    </div>
  );
}