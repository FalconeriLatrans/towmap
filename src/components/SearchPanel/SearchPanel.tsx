import { subscribeAllocations } from "../../services/AllocationService";
import { subscribeParticipants } from "../../services/ParticipantService";
import type { Allocation } from "../../types/Allocation";
import type { Participant } from "../../types/Participant";
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
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    return subscribeAllocations(
      setAllocations
    );
  }, []);

  useEffect(() => {
    return subscribeParticipants(
      setParticipants
    );
  }, []);

  const participantsById =
    Object.fromEntries(
      participants.map(
        p => [p.id, p]
      )
    );

  const allocation =
    allocations.find(
      a => a.seat === selectedSeat
    );

  const occupant =
    participantsById[
      allocation?.participantId ?? ""
    ]?.name ?? "";

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
          allocation.participantId,
          allocation.seat,
        ]
      )
    );

  const sortedParticipants =
    [...participants]
      .filter(p => p.isMember)
      .sort((a, b) => a.name.localeCompare(b.name));



  const items: DropdownItem[] = sortedParticipants.map(participant => {
    const allocated =
      Boolean(
        participantSeats[
        participant.id
        ]
      );
    return {
      id: participant.id,
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
            const seat = participantSeats[id];
            const name = participantsById[id]?.name;
            if (seat) {
              setSelectedSeat(seat);
            } else {
              setToast(
                `${name} has not been assigned to a spot yet.`
              );
            }
            setShowParticipants(false);
          }}
        />
      </div>
    </div>
  )
}
