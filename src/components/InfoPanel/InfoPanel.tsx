import { useEffect, useState } from "react";
import Dropdown from "../Dropdown/Dropdown";
import { getUnallocatedParticipants } from "../../services/ParticipantService";
import type { DropdownItem } from "../Dropdown/Dropdown";
import type { MapElement } from "../../types/MapElement";
//import type { Participant } from "../../types/Participant";
import { allocate } from "../../services/AllocationService";
import "./InfoPanel.css";

type Props = {
  element: MapElement | null;
  occupant: string;
  editorMode: boolean;
};

export default function InfoPanel({
  element,
  occupant,
  editorMode,
}: Props) {

  const [showDropdown, setShowDropdown] = useState(false);
  const [items, setItems] = useState<DropdownItem[]>([]);

  useEffect(() => {
    async function load() {
      const participants =
        await getUnallocatedParticipants();
      setItems([
        {
          id: "",
          content: "Empty",
        },
        ...participants.map(
          participant => ({
            id: participant.id,
            content: participant.name,
          })
        )
      ]);
    }
    load();
  }, [element]);
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

  const code = element.type === "seat"
    ? element.label
    : "";

  const coords = `x:${element.x} y:${element.y}`;

  return (
    <div className="info-panel">
      <div className="occupant-name">
        {
          editorMode &&
            element.type === "seat"
            ? (
              <Dropdown
                button={
                  <>
                    {title}
                    <span>
                      {showDropdown ? "▲" : "▼"}
                    </span>
                  </>
                }
                open={showDropdown}
                direction="up"
                items={items}
                selectedId={occupant}
                onToggle={() =>
                  setShowDropdown(
                    !showDropdown
                  )
                }
                onSelect={async(id) => {
                  console.log(id);
                  await allocate(
                    element.id,
                    element.label,
                    id,
                  );
                  setShowDropdown(false);
                }}
              />
            )
            : (
              title
            )
        }
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