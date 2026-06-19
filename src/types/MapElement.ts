export type MapElement = {

    id: string;
      type:
      | "seat"
      | "HQ"
      | "banner"
      | "trap";
      x: number;
    y: number;
  
    width: number;
    height: number;
  
    seat?: string;
  
    label?: string;
  };