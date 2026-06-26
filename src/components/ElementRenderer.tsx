import Seat from "./Elements/Seat/Seat";
import Trap from "./Elements/Trap/Trap";
import Element from "./Elements/Element";
//import Flag from "./Elements/Banner/Banner";

export default function ElementRenderer({
  element,
  occupant,
  selected,
  editing,
  onClick,
}: any) {

  return (
    <Element
      element={element}
      occupant={occupant}
      selected={selected}
      editing={editing}
      onClick={onClick}
    />
  );

}