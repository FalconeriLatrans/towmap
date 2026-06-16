export default function SeatAllocationModal({
    seat,
    onClose,
  }: Props) {
  
    return (
      <div className="modal-overlay">
  
        <div className="modal">
  
          <h2>{seat}</h2>
  
          <button onClick={onClose}>
            Fechar
          </button>
  
        </div>
  
      </div>
    );
  }