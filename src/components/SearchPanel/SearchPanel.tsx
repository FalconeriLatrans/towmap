import participants from "../../data/participants.json";
import { allocate, getAllocations } from "../../services/AllocationService";
import type { Allocation } from "../../types/Allocation";
import "./SearchPanel.css";
import { useEffect, useState } from "react";

type Props = {
  selectedSeat: string | null;
  editingSeat: string | null;
  setEditingSeat: (seat: string | null) => void;
  setSelectedSeat: (seat: string | null) => void;
  editorMode: boolean;
  setEditorMode: (value: boolean) => void;
  setSelectedOccupant: (occupant: string) => void;
};

export default function SearchPanel({
  setSelectedOccupant,
  selectedSeat,
  editingSeat,
  setEditingSeat,
  setSelectedSeat,
  editorMode,
  setEditorMode,
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

  const allocatedNames =
    allocations.map(
      allocation =>
        allocation.participant
    );

  const participantSeats =
    Object.fromEntries(
      allocations.map(
        allocation => [
          allocation.participant,
          allocation.seat,
        ]
      )
    );

    const availableParticipants =
    participants.filter(
      participant =>
        !allocatedNames.includes(
          String(participant.name)
        )
    );
  
  const participantsToShow =
    editingSeat
      ? availableParticipants
      : participants;
  
  return (
    <div className="search-panel">
      <h2>TOW Map</h2>
      <div className="top-bar">
        <button
          className="participant-selector"
          onClick={() => setShowParticipants(!showParticipants)}
        >
          {
            editingSeat
              ? "🎯 Select occupant"
              : `🔍 ${occupant || "Select player"}`
          }
        </button>
        <button
          className="lock-button"
          onClick={() => {
            if (editorMode) {
              setEditorMode(false);
            } else {
              const password =
                prompt("Password");
              if (password?.trim() === "R4towR5") { 
                setEditorMode(true);
                alert("Editor mode enabled.\n\nTap a seat twice to change its occupant.")
              }
            }
          }}
        >
          {editorMode ? "🔓" : "🔒"}
        </button>
      </div>

      {
        showParticipants && (
          <div className="participant-list">
            {editingSeat && (
              <button
                className="participant-button"
                onClick={async () => { await allocate(editingSeat,"");
                  const data =  await getAllocations();
                  setAllocations(data);
                  setEditingSeat(null);
                  setShowParticipants(false);
                }}
              >
                ⊘ Empty
              </button>
            )}
            {participantsToShow.map(
              participant => {
                const seat =
                  participantSeats[
                  participant.name
                  ];

                return (
                  <button
                    className="participant-button"
                    key={participant.name}
                    onClick={async () => {
                      if (editingSeat) {
                        await allocate(
                          editingSeat,
                          String(participant.name)
                        );
                        const data = await getAllocations();
                        setAllocations(data);
                      } else {
                        if (seat) { setSelectedSeat(seat) }
                      }
                      setShowParticipants(false);
                    }}
                  >
                    {seat
                      ? "✓"
                      : "○"}
                    {" "}
                    {participant.name}
                  </button>
                );
              }
            )}
          </div>
        )
      }
    </div>
  )
}
