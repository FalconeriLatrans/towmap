import csvText from "../data/mapelements.csv?raw";

export default function loadElements() {

  const lines = csvText
      .trim()
      .split("\n");

  return lines
    .slice(1)
    .map(line => {
      const [
        type,
        x,
        y,
        label,
        color,
        number,
      ] = line.split(",");

      return {
        id:`${x.padStart(4,"0")} ${y.padStart(4,"0")}`,
        type,
        x: Number(x),
        y: Number(y),
        label,
        color,
        number: Number(number),
      };
    });
}