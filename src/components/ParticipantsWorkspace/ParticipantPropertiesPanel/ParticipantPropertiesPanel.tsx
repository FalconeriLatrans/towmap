import { useEffect, useState } from "react";
import "./ParticipantPropertiesPanel.css";
import type { Participant } from "../../../types/Participant";
import { archiveParticipant, restoreParticipant, updateParticipant, changeParticipantId, permanentlyDeleteParticipant, generateToken, setParticipantToken } from "../../../services/ParticipantService";

type Props = {
  participant: Participant | null;
  onRemoved?: () => void;
  onRestored?: () => void;
  onDeleted?: () => void;
};

export default function ParticipantPropertiesPanel({
  participant,
  onRemoved,
  onRestored,
  onDeleted,
}: Props) {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleGenerateToken() {
    if (!participant) return;
    const generatedToken = await generateToken();
    await setParticipantToken(participant.id, generatedToken, true);
  }

  async function handleRevokeToken() {
    if (!participant) return;
    await setParticipantToken(participant.id, participant.token ?? "", false);
  }

  useEffect(() => {
    if (!participant) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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

  async function handleRemove() {
    if (!participant) return;

    const confirmed = window.confirm(
      `Archive ${participant.name}?\n\n` +
      "The participant will be removed from the active members list, " +
      "but their data and spot allocation will be preserved."
    );

    if (!confirmed) return;

    try {
      await archiveParticipant(participant.id);
      onRemoved?.();
    } catch (error) {
      console.error("Error archiving participant:", error);
    }
  }

  async function handlePermanentDelete() {
    if (!participant) return;

    const confirmed = window.confirm(
      `Permanently delete ${participant.name}?\n\n` +
      "This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      await permanentlyDeleteParticipant(participant.id);

      onDeleted?.();

    } catch (error) {
      if (
        error instanceof Error &&
        error.message.startsWith(
          "PARTICIPANT_HAS_ALLOCATION:"
        )
      ) {
        const cityLabel = error.message.split(":")[1];

        window.alert(
          `${participant.name} is still assigned to ` +
          `${cityLabel || "a spot"}.\n\n` +
          "Clear the spot before permanently deleting this participant."
        );
        return;
      }
      console.error(
        "Error permanently deleting participant:",
        error
      );
    }
  }

  if (!participant) {
    return (
      <div className="participant-properties-panel collapsed">
        <span>Select a participant to view details</span>
      </div>
    );
  }
  async function handleRestore() {
    if (!participant) return;

    try {
      await restoreParticipant(participant.id);
      onRestored?.();
    } catch (error) {
      console.error("Error restoring participant:", error);
    }
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
          <div className="participant-token-actions">
            <button type="button" onClick={handleGenerateToken}>Generate token</button>
            <button type="button" onClick={handleRevokeToken} disabled={!participant.tokenActive}>
              Revoke token
            </button>
          </div>
        </label>
        <label className="participant-field">
          <span>Alliance status</span>
          <button
            type="button"
            className="blacklist-button"
            onClick={() => updateParticipant({ ...participant, isBlacklisted: !participant.isBlacklisted })}
          >
            {participant.isBlacklisted ? "☠ Marked" : "Mark ☠"}
          </button>
        </label>
      </div>
      <div className="participant-properties-actions">

        {participant.isMember ? (
          <>
            <button
              type="button"
              className="remove-button"
              onClick={handleRemove}
            >
              Remove
            </button>
            <button
              type="button"
              className="save-button"
              onClick={handleSave}
              disabled={!hasChanges || saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="remove-button"
              onClick={handlePermanentDelete}
            >
              Delete permanently
            </button>
            <button
              type="button"
              className="restore-button"
              onClick={handleRestore}
            >
              Restore
            </button>
          </>
        )}
      </div>
    </div>
  );
}
