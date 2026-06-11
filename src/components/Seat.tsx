type SeatProps = {
    seat: string;
  };
  
  export default function Seat({
    seat,
  }: SeatProps) {
    return (
      <div className="seat">
        {seat}
      </div>
    );
  }