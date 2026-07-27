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

  /* LOG PARA VERIFICAR IDS ERRADOS NO FIRESTORE
    console.log(
      "Participants:",
      participants.map((p) => ({
        id: p.id,
        name: p.name,
      }))
    );
  
    const ids = participants.map((p) => p.id);
  
  console.log(
    "Invalid IDs:",
    participants.filter((p) => !p.id)
  );
  
  console.log(
    "Duplicate IDs:",
    ids.filter((id, index) => ids.indexOf(id) !== index)
  );
  */

    return (
    <div className="participants-list">
      {participants.map(participant => (
        
        <button
          key={participant.id}
          className={
            "participant-card" +
            (participant.id === selectedId ? " selected" : "")
          }
          onClick={() => onSelect(participant.id)}
        >
          <div className="drag-handle">
          ⇅
          </div>

          <span className="participant-name">
            {participant.name}
          </span>

          {participant.id.startsWith("tmp_") && (
            <span
              className="participant-warning"
              title="Participant ID needs to be confirmed"
            />
            )}
        </button>
      ))}
    </div>
  );
}