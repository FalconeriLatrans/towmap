import type { Allocation } from "../../types/Allocation";
import type { Participant } from "../../types/Participant";
import { useEffect, useState } from "react";
import "./TopBar.css";

type Props = {
  title: string;
  center?: React.ReactNode;
  actions?: React.ReactNode;
};

export default function TopBar({
  title,
  center,
  actions,
}: Props) {

  const [showParticipants, setShowParticipants] = useState(false);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);

  return (
    <div className="search-panel">
      <div className="panel-header">
        <h2>{title}</h2>
        {actions}
      </div>
      {center && (
        <div className="top-bar">
          {center}
        </div>
      )}
    </div>
  );
}
