import csvText from "../data/mapelements.csv?raw";

const dimensions = {
  seat: { width: 2, height: 2 },
  trap: { width: 3, height: 3 },
  banner: { width: 1, height: 1 },
  city: { width: 2, height: 2 },
  hq: { width: 3, height: 3 },
  any: { width: 2, height: 2 },
};

export default function loadElements() {

  const lines = csvText
    .trim()
    .split("\n");

  return lines
    .slice(1)
    .map(line => {

      const [type, x, y, label, color, number] = line.split(",");
      const size = dimensions[type as keyof typeof dimensions] ?? { width: 2, height: 2 };

      return {
        id: `${x.padStart(4, "0")} ${y.padStart(4, "0")}`,
        type: type === "city" ?"seat" :type,
        x: Number(x),
        y: Number(y),
        label,
        color,
        number: Number(number),
        width: size.width,
        height: size.height,
      };
    });
}