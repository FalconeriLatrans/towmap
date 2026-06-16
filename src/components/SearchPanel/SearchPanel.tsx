import participants from "../../data/participants.json";
import { allocate, getAllocation } from "../../services/AllocationService";
import "./SearchPanel.css";
import { useEffect, useState } from "react";

type Props = {
  selectedSeat: string | null;
  editingSeat: string | null;
};

export default function SearchPanel({
  selectedSeat,
  editingSeat,
}: Props) {

  const [occupant, setOccupant] = useState<string>("");

  useEffect(() => {
    if (!selectedSeat) {
      setOccupant("");
      return;
    }
    async function load() {
      const allocation =
        await getAllocation(
          selectedSeat
        );
      setOccupant(
        allocation?.participant || ""
      );
    }
    load();
  }, [selectedSeat]);

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

            if (!selectedSeat) return;
            const participant =
              e.target.value;
            await allocate(
              selectedSeat,
              participant
            );

            setOccupant(
              participant
            );
          }}
        >
          <option value="">
            Nenhum
          </option>
          {participants.map(
            participant => (
              <option
                key={participant.name}
              >
                {participant.name}
              </option>
            )
          )}
        </select>
      )}
    </div>
  );
}