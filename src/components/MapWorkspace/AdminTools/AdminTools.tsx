import { getAllocations } from "../../../services/AllocationService";
import { getParticipants, setParticipantToken, generateToken } from "../../../services/ParticipantService";

function download(name: string, rows: object[]) {
  const records = rows as Record<string, unknown>[];
  const headers = [...new Set(records.flatMap(row => Object.keys(row)))];
  const csv = [headers.join(","), ...records.map(row => headers.map(key => JSON.stringify(row[key] ?? "")).join(","))].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const link = document.createElement("a");
  link.href = url; link.download = name; link.click(); URL.revokeObjectURL(url);
}

export default function AdminTools({ onLogout }: { onLogout: () => void }) {
  async function generateAll() {
    if (!window.confirm("Generate new tokens for every participant? Existing tokens will stop working.")) return;
    const participants = await getParticipants();
    await Promise.all(participants.map(async participant =>
      setParticipantToken(participant.id, await generateToken(), true)));
  }
  async function revokeAll() {
    if (!window.confirm("Revoke every player token?")) return;
    const participants = await getParticipants();
    await Promise.all(participants.map(participant => setParticipantToken(participant.id, participant.token, false)));
  }
  return <details className="admin-tools"><summary>⚙</summary><div>
    <button onClick={async () => download("towmap-participants.csv", await getParticipants())}>⇩ Players CSV</button>
    <button onClick={async () => download("towmap-allocations.csv", await getAllocations())}>⇩ Allocations CSV</button>
    <button onClick={generateAll}>🔑 Generate all</button><button onClick={revokeAll}>🚫 Revoke all</button>
    <button onClick={onLogout}>↪ Log out</button>
  </div></details>;
}
