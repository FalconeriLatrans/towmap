import "./Trap.css";
import "../Elements.css";

type Props = {
  label?: string;
  color: string;
  onClick?: (trap: string) => void;
};

export default function Trap({
  label,
  color,
  onClick,
}: Props) {

  return (
    <div className="map-element trap"
      style={{ backgroundColor: color }}
      onClick={() => onClick?.(id)}
    >
      {label}
    </div>
  );

}