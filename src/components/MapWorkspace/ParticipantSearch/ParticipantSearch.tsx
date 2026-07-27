import "./ParticipantSearch.css";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { Participant } from "../../../types/Participant";


type Props = {
  participants: Participant[];
  onSelect: (participantId: string) => void;
};


function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}


export default function ParticipantSearch({
  participants,
  onSelect,
}: Props) {

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);


  const filteredParticipants = useMemo(() => {

    const normalizedSearch = normalizeText(search);

    if (!normalizedSearch) {
      return participants;
    }

    return participants.filter(participant =>
      normalizeText(participant.name)
        .includes(normalizedSearch)
    );

  }, [participants, search]);


  useEffect(() => {

    function handleClickOutside(event: MouseEvent) {

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }

    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

  }, []);


  function handleSelect(participantId: string) {

    onSelect(participantId);

    setSearch("");
    setOpen(false);

  }


  return (
    <div
      className="participant-search"
      ref={searchRef}
    >

      <div className="participant-search-input-wrapper">

        <span className="participant-search-icon">
          🔍
        </span>

        <input
          type="text"
          value={search}
          placeholder="Search participant..."
          onFocus={() => setOpen(true)}
          onChange={event => {
            setSearch(event.target.value);
            setOpen(true);
          }}
        />

        {search && (
          <button
            type="button"
            className="participant-search-clear"
            onClick={() => {
              setSearch("");
              setOpen(true);
            }}
            aria-label="Clear search"
          >
            ×
          </button>
        )}

      </div>


      {open && (
        <div className="participant-search-results">

          {filteredParticipants.length > 0 ? (

            filteredParticipants.map(participant => (
              <button
                key={participant.id}
                type="button"
                className="participant-search-result"
                onClick={() =>
                  handleSelect(participant.id)
                }
              >
                {participant.name}
              </button>
            ))

          ) : (

            <div className="participant-search-empty">
              No participants found
            </div>

          )}

        </div>
      )}

    </div>
  );
}