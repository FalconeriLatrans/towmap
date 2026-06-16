import Seat from "./Elements/Seat/Seat";
//import Stage from "./Elements/Trap/Trap";
//import Flag from "./Elements/Banner/Banner";

type Props = {
  element: any;
};

export default function ElementRenderer({
  element,
}: Props) {

  switch (element.type) {

    case "seat":
      return <Seat seat={element.seat} />;

  /*  case "trap":
      return <Trap element={element} />;

    case "banner":
      return <Flag element={element} />;
*/
    default:
      return null;
  }

}