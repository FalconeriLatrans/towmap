import "./ParticipantsList.css";
import type { Participant } from "../../types/Participant";

type Props = {
  participants: Participant[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export default function ParticipantsList({
  participants,
  selectedId,
  onSelect,
}: Props) {
  return (
    <div className="participants-list">
      {participants.map(participant => (
        <button
          className={
            "participant-card" +
            (participant.id === selectedId ? " selected" : "")
          }
          onClick={() => onSelect(participant.id)}
        >
          <div className="drag-handle">
            ☰
          </div>

          <div className="participant-name">
            {participant.name}
          </div>
        </button>
      ))}
    </div>
  );
}