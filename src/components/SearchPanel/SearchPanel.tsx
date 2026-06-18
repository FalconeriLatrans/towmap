import participants from "../../data/participants.json";
import { allocate, getAllocations } from "../../services/AllocationService";
import type { Allocation } from "../../types/Allocation";
import "./SearchPanel.css";
import { useEffect, useState } from "react";

type Props = {
  selectedSeat: string | null;
  editingSeat: string | null;
  setSelectedSeat: (seat: string | null) => void;
  editorMode: boolean;
  setEditorMode: (value: boolean) => void;
};

export default function SearchPanel({
  selectedSeat,
  editingSeat,
  setSelectedSeat,
  editorMode,
  setEditorMode,
}: Props) {

  const [
    allocations,
    setAllocations,
  ] = useState<Allocation[]>([]);

  const [
    participantsOpen,
    setParticipantsOpen
  ] = useState(false);
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
        participant.name === occupant ||
        !allocatedNames.includes(
          participant.name
        )
    );

  const allocatedCount = allocatedNames.length;
  const totalCount = participants.length;
  //const pendingCount = totalCount - allocatedCount;

  return (
    <div>
      <h2>TOW Map</h2>
      {editorMode ? (
        <button
          onClick={() => {
            setEditorMode(false);
          }}
        >
          🔓 Editor mode
        </button>
      ) : (

        <button
          onClick={() => {
            const password =
              prompt(
                "Digite a senha"
              );
            if (
              password ===
              "R4towR5"
            ) {
              setEditorMode(true);
            } else {
              alert(
                "Senha incorreta"
              );
            }
          }}
        >
          🔒 Enter Editor mode
        </button>
      )}
      <p>
        Spot:
        {" "}
        {selectedSeat || "-"}
      </p>

      <p>
        Occupant:
        {" "}
        {occupant || "Empty"}
      </p>
      {editingSeat && (
        <select
          value={occupant}
          onChange={async (e) => {
            if (!selectedSeat)
              return;
            const participant =
              e.target.value;
            await allocate(
              selectedSeat,
              participant
            );
            const data =
              await getAllocations();
            setAllocations(
              data
            );
          }}
        >
          <option value="">
            Empty
          </option>
          {availableParticipants.map(
            participant => (
              <option
                key={
                  participant.name
                }
                value={
                  participant.name
                }
              >
                {participant.name}
              </option>
            )
          )}
        </select>
      )}

      <hr />
      <button
        onClick={() =>
          setParticipantsOpen(
            !participantsOpen
          )
        }
      >
        Players
        {" "}
        {participantsOpen
          ? "▲"
          : "▼"}
        {" "}
        ({allocatedCount}/{totalCount})
      </button>

      {participantsOpen && (
        <div>
          {participants.map(
            participant => {
              const seat =
                participantSeats[
                participant.name
                ];

              return (
                <button
                  key={participant.name}
                  onClick={() => {
                    if (seat) {
                      setSelectedSeat(
                        seat
                      );
                    }
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
      )}
    </div>
  );
}