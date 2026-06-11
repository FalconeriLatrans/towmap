type SeatProps = {
    seat: string;
  };
  
  export default function Seat({
    seat,
  }: SeatProps) {
  
    const seatNumber =
      parseInt(
        seat.split(" ")[1]
      );
  
    const category =
      Math.floor(
        seatNumber / 100
      );
  
    const colors: Record<number, string> = {
      1: "#2d5fb8",
      2: "#7c95b6",
      3: "#d0d4da",
      4: "#efe4c3",
    };
  
    return (
      <div
        className="seat"
        style={{
          backgroundColor:
            colors[category] || "#ffffff",
        }}
      >
        {seat}
      </div>
    );
  }