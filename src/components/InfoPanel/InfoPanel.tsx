// src/components/InfoPanel/InfoPanel.tsx
import "./InfoPanel.css";

type Props = {
    seat: string | null;
    occupant: string;
  };
  
  export default function InfoPanel({
    seat,
    occupant,
  }: Props) {
  
    if (!seat) {
      return (
        <div className="info-panel">
          <div className="empty-selection">
            Select a player or a spot
          </div>
        </div>
      );
    }
  
    return (
      <div className="info-panel">
  
        <div className="occupant-name">
          {occupant || "Empty"}
        </div>
  
        <div className="info-row">
          <span className="info-label">
            Spot
          </span>
  
          <span className="info-value">
            {seat}
          </span>
        </div>
  
      </div>
    );
  }