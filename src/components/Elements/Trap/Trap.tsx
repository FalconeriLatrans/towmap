import "./Trap.css";
import "../Elements.css";

type Props = {
  label?: string;
  color: string;
};

export default function Trap({
  label,
  color,
}: Props) {

  return (
    <div className="map-element trap"
      style={{ backgroundColor: color }}
    >
      {label}
    </div>
  );

}