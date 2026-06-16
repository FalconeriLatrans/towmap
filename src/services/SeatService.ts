import seats from "../data/seats.json";

export function findSeatByOccupant(name: string) {
  return seats.find(
    seat =>
      seat.occupant
        .toLowerCase()
        .includes(name.toLowerCase())
  );
}