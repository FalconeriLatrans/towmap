import "./ParticipantPropertiesPanel.css";
import type { Participant } from "../../../types/Participant";

type Props = {
  participant: Participant | null;
};

export default function ParticipantPropertiesPanel({
  participant,
}: Props) {
  if (!participant) {
    return (
      <div className="properties-panel">
        <h3>Participants</h3>
        <div className="panel-empty">
          <p>Select a participant.</p>
          <div className="participant-stats">
            <div>
              <strong>Members</strong>
              <span>0</span>
            </div>
            <div>
              <strong>Former members</strong>
              <span>0</span>
            </div>
            <div>
              <strong>Unallocated</strong>
              <span>0</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="properties-panel">
      <h3>Participant</h3>
      <label>
        Name
        <input
          value={participant.name}
          disabled
          readOnly
        />
      </label>
      <label>
        Priority
        <input
          value={participant.order}
          disabled
          readOnly
        />
      </label>
      <label>
        Level
        <input
          value={participant.level}
          disabled
          readOnly
        />
      </label>
      <label>
        Power
        <input
          value={participant.power}
          disabled
          readOnly
        />
      </label>
      <label>
        Token
        <input
          value={participant.token}
          disabled
          readOnly
        />
      </label>
      <label className="checkbox">
        <input
          type="checkbox"
          checked={participant.isMember}
          disabled
          readOnly
        />
        Alliance member
      </label>
      <button disabled>
        Save
      </button>
    </div>
  );
}