import { useEffect, useState } from "react";
import Dropdown from "../../Dropdown/Dropdown";
import { getUnallocatedParticipants, updateParticipant } from "../../../services/ParticipantService";
import type { Participant } from "../../../types/Participant";
import type { DropdownItem } from "../../Dropdown/Dropdown";
import type { MapElement } from "../../../types/MapElement";
import { allocate } from "../../../services/AllocationService";
import "./ElementPropertiesPanel.css";

type Props = {
  element: MapElement | null;
  occupant: string;
  editorMode: boolean;
  player: Participant | null;
  participants: Participant[];
};

export default function ElementPropertiesPanel({
  element,
  occupant,
  editorMode,
  player,
  participants,
}: Props) {

  const [showDropdown, setShowDropdown] = useState(false);
  const [items, setItems] = useState<DropdownItem[]>([]);

  useEffect(() => {
    async function load() {

      const participants = await getUnallocatedParticipants();

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

  const selectedElement = element;

  const title = occupant || selectedElement.label || "Empty";
  const code = selectedElement.type === "city"
    ? selectedElement.label
    : "";
  const coords = `x:${selectedElement.x} y:${selectedElement.y}`;
  const preferenceIndex = player && selectedElement.type === "city"
    ? [player.preference1, player.preference2, player.preference3].indexOf(selectedElement.id)
    : -1;
  const higherPriorityCount = player && selectedElement.type === "city"
    ? participants.filter(participant => participant.isMember && participant.order < player.order &&
        [participant.preference1, participant.preference2, participant.preference3].includes(selectedElement.id)).length
    : 0;

  async function setPreference(index: number) {
    if (!player || selectedElement.type !== "city") return;
    const key = `preference${index + 1}` as "preference1" | "preference2" | "preference3";
    const preferences = [player.preference1, player.preference2, player.preference3]
      .map(preference => preference === selectedElement.id ? undefined : preference);
    preferences[index] = selectedElement.id;
    await updateParticipant({
      ...player,
      preference1: preferences[0],
      preference2: preferences[1],
      preference3: preferences[2],
      [key]: selectedElement.id,
    });
  }

  return (
    <div className="info-panel">
      <div className="occupant-name">
        {
          editorMode &&
            element.type === "city"
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
                    id
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
      {player && element.type === "city" && (
        <div className="player-preferences">
          <p>{higherPriorityCount} higher-priority player(s) chose this seat.</p>
          <div>
            {[0, 1, 2].map(index => (
              <button key={index} onClick={() => setPreference(index)}>
                {preferenceIndex === index ? `Preference ${index + 1} ✓` : `Set preference ${index + 1}`}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
