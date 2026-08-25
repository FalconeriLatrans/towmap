import { useMemo, useState } from "react";
import loadElements from "../../../services/loadElements";
import { replaceAllocations } from "../../../services/AllocationService";
import { simulateAllocationEvent } from "../../../services/AllocationEventService";
import type { Participant } from "../../../types/Participant";
import "./AllocationEventPanel.css";

type Props = {
  participants: Participant[];
  onClose: () => void;
};

export default function AllocationEventPanel({ participants, onClose }: Props) {
  const [confirming, setConfirming] = useState(false);
  const cityIds = useMemo(
    () => loadElements().filter(element => element.type === "city").map(element => element.id),
    []
  );
  const preview = useMemo(
    () => simulateAllocationEvent(participants, cityIds),
    [participants, cityIds]
  );
  const assignedCount = Object.keys(preview.assignments).length;

  async function handleConfirm() {
    if (preview.issues.length) return;
    setConfirming(true);
    try {
      await replaceAllocations(preview.assignments);
      onClose();
    } finally {
      setConfirming(false);
    }
  }

  return (
    <div className="allocation-event-backdrop" role="dialog" aria-modal="true">
      <section className="allocation-event-panel">
        <div className="allocation-event-header">
          <h3>Allocation event preview</h3>
          <button onClick={onClose}>×</button>
        </div>
        <p>{assignedCount} members will receive an official seat.</p>
        {preview.issues.length > 0 ? (
          <>
            <p className="allocation-event-warning">
              Resolve all pending members before confirming this event.
            </p>
            <ul>
              {preview.issues.map(issue => (
                <li key={issue.participantId}>
                  <strong>{issue.participantName}</strong>: {issue.reason === "missing-preferences"
                    ? "no preferences registered"
                    : "all preferred seats are already taken"}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="allocation-event-ready">All active members have a valid seat.</p>
        )}
        <div className="allocation-event-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleConfirm} disabled={Boolean(preview.issues.length) || confirming}>
            {confirming ? "Confirming..." : "Confirm official allocation"}
          </button>
        </div>
      </section>
    </div>
  );
}
