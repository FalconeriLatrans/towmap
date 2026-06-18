import participants from "../../data/participants.json";
import { allocate, getAllocations } from "../../services/AllocationService";
import type { Allocation } from "../../types/Allocation";
import "./SearchPanel.css";
import { useEffect, useState } from "react";

type Props = {
  selectedSeat: string | null;
  editingSeat: string | null;
  setSelectedSeat: (
    seat: string | null
  ) => void;
};

export default function SearchPanel({
  selectedSeat,
  editingSeat,
  setSelectedSeat,
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
  const pendingCount = totalCount - allocatedCount;

  return (
    <div>
      <h2>Painel</h2>
      <p>
        Assento:
        {" "}
        {selectedSeat || "-"}
      </p>

      <p>
        Ocupante:
        {" "}
        {occupant || "Nenhum"}
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
            Nenhum
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
        Participantes
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