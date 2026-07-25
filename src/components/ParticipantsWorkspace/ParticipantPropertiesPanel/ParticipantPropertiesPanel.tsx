import { useEffect, useState } from "react";
import "./ParticipantPropertiesPanel.css";
import type { Participant } from "../../../types/Participant";
import { archiveParticipant, updateParticipant, changeParticipantId } from "../../../services/ParticipantService";

type Props = {
  participant: Participant | null;
  onArchived?: () => void;
};

export default function ParticipantPropertiesPanel({
  participant,
  onArchived,
}: Props) {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!participant) {
      setName("");
      setId("");
      setToken("");
      return;
    }

    setName(participant.name);
    setId(participant.id);
    setToken(participant.token ?? "");
  }, [participant]);

  async function handleCopyToken() {
    if (!token) return;

    await navigator.clipboard.writeText(token);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  async function handleSave() {
    if (!participant) return;

    const trimmedName = name.trim();
    const trimmedId = id.trim();
    const trimmedToken = token.trim();

    if (!trimmedName || !trimmedId) {
      return;
    }

    if (trimmedId !== participant.id) {
      console.log(
        `ID migration required: ${participant.id} -> ${trimmedId}`
      );
      await changeParticipantId(participant.id, trimmedId);

      return;
    }

    setSaving(true);

    try {
      await updateParticipant({
        ...participant,
        name: trimmedName,
        token: trimmedToken,
      });
    } finally {
      setSaving(false);
    }
  }
  async function handleArchive() {
    if (!participant) return;

    const confirmed = window.confirm(
      `Archive ${participant.name}?\n\n` +
      "The participant will be removed from the active members list, " +
      "but their data and seat allocation will be preserved."
    );

    if (!confirmed) return;

    try {
      await archiveParticipant(participant.id);
      onArchived?.();
    } catch (error) {
      console.error("Error archiving participant:", error);
    }
  }

  if (!participant) {
    return (
      <div className="participant-properties-panel collapsed">
        <span>Select a participant to view details</span>
      </div>
    );
  }

  const hasChanges =
    name.trim() !== participant.name ||
    id.trim() !== participant.id ||
    token.trim() !== (participant.token ?? "");

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
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </label>

        <label className="participant-field">
          <span className="participant-field-label">
            ID

            {participant.id.startsWith("tmp_") && (
              <span
                className="field-warning"
                title="Temporary ID — replace it with the player's Game ID"
              >
                ● Temporary ID
              </span>
            )}
          </span>

          <input
            type="text"
            value={id}
            onChange={e => setId(e.target.value)}
          />
        </label>

        <label className="participant-field participant-token-field">
          <span>Allocation Token</span>

          <div className="participant-token-row">

            <input
              type="text"
              value={token}
              onChange={e => setToken(e.target.value)}
            />

            <button
              type="button"
              className="copy-token-button"
              onClick={handleCopyToken}
              disabled={!token}
            >
              {copied ? "Copied!" : "Copy"}
            </button>

          </div>
        </label>

      </div>

      <div className="participant-properties-actions">

        <button
          type="button"
          className="archive-button"
          onClick={handleArchive}
        >
          🗑 Remove
        </button>

        <button
          type="button"
          className="save-button"
          onClick={handleSave}
          disabled={!hasChanges || saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

      </div>

    </div>
  );
}