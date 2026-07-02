import participants from "../../data/participants.json";
import { getAllocations } from "../../services/AllocationService";
import type { Allocation } from "../../types/Allocation";
import "./SearchPanel.css";
import { useEffect, useState } from "react";
import { sha256 } from "../../services/hash";
import Dropdown from "../Dropdown/Dropdown";
import type { DropdownItem } from "../Dropdown/Dropdown";

type Props = {
  selectedSeat: string | null;
  setSelectedSeat: (seat: string | null) => void;
  editorMode: boolean;
  setEditorMode: (value: boolean) => void;
  setSelectedOccupant: (occupant: string) => void;
  setToast: (message: string) => void;
};

export default function SearchPanel({
  setSelectedOccupant,
  selectedSeat,
  setSelectedSeat,
  editorMode,
  setEditorMode,
  setToast,
}: Props) {

  const [showParticipants, setShowParticipants] = useState(false);
  const [allocations, setAllocations] = useState<Allocation[]>([]);

  useEffect(() => {
    async function load() {
      const data =
        await getAllocations();
      setAllocations(data);
    }
    load();
  }, [selectedSeat]);

  const occupant =
    allocations.find(
      allocation =>
        allocation.seat === selectedSeat
    )?.participant ?? "";

  useEffect(() => {
    setSelectedOccupant(occupant);
  }, [
    occupant,
    setSelectedOccupant
  ]);

  useEffect(() => {
    setShowParticipants(false);
  }, [selectedSeat]);

  const participantSeats =
    Object.fromEntries(
      allocations.map(
        allocation => [
          allocation.participant,
          allocation.seat,
        ]
      )
    );

  console.log(participants[0]);
  console.log(typeof participants[0].name);
  console.log(participants[0].name);

  const sortedParticipants = [...participants].sort(
    (a, b) =>
      String(a.name).localeCompare(String(b.name), "en")
  );

  const items: DropdownItem[] = sortedParticipants.map(participant => {
    const allocated =
      Boolean(
        participantSeats[
        participant.name
        ]
      );
    return {
      id: participant.name,
      content: (
        <>
          {allocated ? "✓" : "○"}{" "}
          {participant.name}
        </>
      ),
    };
  });

  return (
    <div className="search-panel">
       <div className="panel-header">
      <h2>TOW Map</h2>
      <button
        className="lock-button"
        onClick={async () => {
          if (editorMode) {
            setEditorMode(false);
          } else {
            const password = prompt("Editor password");
            const hash = await sha256(password?.trim() ?? "");
            if (hash === "71b4354a60c9f304ae9099650b537a63d3f10625873584be2580ef8da5c96361") {
              setEditorMode(true);
              setToast("🔓 Editor mode enabled");
            } else {
              setToast("❌ Invalid password");
            }
          }
        }}
      >
        {editorMode ? "⚙" : "🔒"}
      </button>
      </div>
      <div className="top-bar">
        <Dropdown
          button={
            <>
              🔍 {occupant || "Select player"}
              <span>
                {showParticipants ? "▲" : "▼"}
              </span>
            </>
          }
          open={showParticipants}
          items={items}
          selectedId={occupant}
          onToggle={() =>
            setShowParticipants(
              !showParticipants
            )
          }
          onSelect={id => {
            const seat =
              participantSeats[id];
            if (seat) {
              setSelectedSeat(seat);
            } else {
              setToast(
                `${id} has not been assigned to a spot yet.`
              );
            }
            setShowParticipants(false);
          }}
        />
      </div>
    </div>
  )
}
