import { useState } from "react";
import { getParticipantByToken } from "../../../services/ParticipantService";
import type { Participant } from "../../../types/Participant";

type Props = {
  player: Participant | null;
  onLogin: (participantId: string) => void;
  onLogout: () => void;
  onError: (message: string) => void;
};

export default function PlayerAccess({ player, onLogin, onLogout, onError }: Props) {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    const participant = await getParticipantByToken(token.trim());
    if (!participant) {
      setError("");
      onError("Invalid or inactive token");
      return;
    }
    setError("");
    setToken("");
    onLogin(participant.id);
  }

  if (player) {
    return <button className="workspace-button" onClick={onLogout} title="Leave player mode">↪</button>;
  }

  return (
    <div className="player-access">
      <input value={token} onChange={event => setToken(event.target.value)} placeholder="Player token" aria-label="Player token" />
      <button onClick={handleLogin}>Enter</button>
      {error && <span className="player-access-error">{error}</span>}
    </div>
  );
}
