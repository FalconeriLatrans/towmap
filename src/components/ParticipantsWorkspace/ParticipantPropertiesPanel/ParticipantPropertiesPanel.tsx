import { useState } from "react";
import "./ParticipantPropertiesPanel.css";
import type { Participant } from "../../../types/Participant";

type Props = {
  participant: Participant | null;
};

export default function ParticipantPropertiesPanel({
  participant,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopyToken() {
    if (!participant?.token) return;

    await navigator.clipboard.writeText(participant.token);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  if (!participant) {
    return (
      <div className="participant-properties-panel collapsed">
        <span>Select a participant to view details</span>
      </div>
    );
  }

  return (
    <div className="participant-properties-panel expanded">

      <div className="participant-properties-header">
        <h3>{participant.name}</h3>
      </div>

      <div className="participant-properties-grid">

        <label className="participant-field">
          <span>Name</span>

          <input
            type="text"
            value={participant.name}
            readOnly
          />
        </label>

        <label className="participant-field">
          <span>ID</span>

          <input
            type="text"
            value={participant.id}
            readOnly
          />
        </label>

        <label className="participant-field participant-token-field">
          <span>Allocation Token</span>

          <div className="participant-token-row">
            <input
              type="text"
              value={participant.token}
              readOnly
            />

            <button
              type="button"
              className="copy-token-button"
              onClick={handleCopyToken}
              disabled={!participant.token}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </label>

      </div>

      <div className="participant-properties-actions">
        <button
          type="button"
          className="save-button"
          disabled
        >
          Save Changes
        </button>
      </div>

    </div>
  );
}