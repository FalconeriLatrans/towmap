import "./Dropdown.css";
import { useEffect, useRef } from "react";

export type DropdownItem = {
  id: string;
  content: React.ReactNode;
};

type Props = {
  button: React.ReactNode;
  open: boolean;
  direction?: "up" | "down";
  //align?: "left" | "right";
  items: DropdownItem[];
  selectedId?: string;
  onToggle: () => void;
  onSelect: (item: DropdownItem[]) => void;
  //compact?: boolean;
};

export default function Dropdown({
  button,
  open,
  direction = "down",
  //align = "left",
  items,
  selectedId,
  onToggle,
  onSelect,
  //compact,
}: Props) {

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) { onToggle(); }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onToggle]);

  return (
    <div className="dropdown" ref={dropdownRef}>
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
              onClick={() => onSelect(item)}
            >
              {item.content}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}