import Seat from "./Elements/Seat/Seat";
import Trap from "./Elements/Trap/Trap";
//import Flag from "./Elements/Banner/Banner";

export default function ElementRenderer({
  element,
  occupant,
  selected,
  editing,
  onClick,
}: any) {

  switch (element.type) {
    case "seat":
      return (
        <Seat
          id={element.id}
          label={element.label}
          color={element.color}
          occupant={occupant}
          selected={selected}
          editing={editing}
          onClick={onClick}
        />
      );
    case "banner":
    case "hq":
    case "trap":
      return (
        <Trap
          label={element.label}
          color={element.color}
          onClick={onClick}
        />
      );
    default:
      return null;
  }
}