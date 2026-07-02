import "./Dropdown.css";

export type DropdownItem = {
  id: string;
  content: React.ReactNode;
};

type Props = {
  button: React.ReactNode;
  open: boolean;
  direction?: "up" | "down";
  align?: "left" | "right";
  items: DropdownItem[];
  selectedId?: string;
  onToggle: () => void;
  onSelect: (id: string) => void;
  compact?: boolean;
};

export default function Dropdown({
  button,
  open,
  direction = "down",
  align = "left",
  items,
  selectedId,
  onToggle,
  onSelect,
  compact,
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