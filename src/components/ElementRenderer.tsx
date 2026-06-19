import Seat from "./Elements/Seat/Seat";
import Trap from "./Elements/Trap/Trap";
//import Flag from "./Elements/Banner/Banner";

type Props = {
  element: any;
};


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
          seat={element.seat}
          occupant={occupant}
          selected={selected}
          editing={editing}
          onClick={onClick}
        />
      );
    case "trap":
      return (
        <Trap
          label={element.label}
        />
      );
    default:
      return null;
  }
}