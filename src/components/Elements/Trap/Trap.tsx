import "./Trap.css";

type Props = {
  label?: string;
};

export default function Trap({
  label,
}: Props) {

  return (
    <div className="trap">
      {label}
    </div>
  );

}