import "./Trap.css";
import "../Elements.css";

type Props = {
  label?: string;
};

export default function Trap({
  label,
}: Props) {

  return (
    <div className="map-element trap">
      {label}
    </div>
  );

}