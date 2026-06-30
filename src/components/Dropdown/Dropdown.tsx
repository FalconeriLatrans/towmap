import "./Dropdown.css";

export type DropdownItem = {
  id: string;
  content: React.ReactNode;
};

type Props = {
  button: React.ReactNode;
  open: boolean;
  direction?: "up" | "down";
  items: DropdownItem[];
  selectedId?: string;
  onToggle: () => void;
  onSelect: (id: string) => void;
};

export default function Dropdown({
  button,
  open,
  direction = "down",
  items,
  selectedId,
  onToggle,
  onSelect,
}: Props) {

  return (
    <div className="dropdown">
      <button
        className="dropdown-trigger"
        onClick={onToggle}
      >
        {button}
      </button>
      {open && (
        <div
          className={`dropdown-popup ${direction}`}
        >
          {items.map(item => (
            <button
              key={item.id}
              className={`dropdown-item ${
                item.id === selectedId
                  ? "selected"
                  : ""
              }`}
              onClick={() => onSelect(item.id)}
            >
              {item.content}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}