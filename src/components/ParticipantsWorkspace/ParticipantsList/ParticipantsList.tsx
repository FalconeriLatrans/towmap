import "./ParticipantsList.css";
import { useEffect, useState } from "react";
import type { Participant } from "../../types/Participant";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";


type Props = {
  participants: Participant[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};


export default function ParticipantsList({
  participants,
  selectedId,
  onSelect,
}: Props) {

  const [items, setItems] = useState(participants);

  useEffect(() => {
    setItems(participants);
  }, [participants]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  function handleDragEnd(event: DragEndEvent) {

    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setItems(currentItems => {

      const oldIndex = currentItems.findIndex(
        participant => participant.id === active.id
      );

      const newIndex = currentItems.findIndex(
        participant => participant.id === over.id
      );

      return arrayMove(
        currentItems,
        oldIndex,
        newIndex
      );
    });
  }


  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map(participant => participant.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="participants-list">
          {items.map(participant => (
            <SortableParticipant
              key={participant.id}
              participant={participant}
              selected={
                participant.id === selectedId
              }
              onSelect={onSelect}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}


type SortableParticipantProps = {
  participant: Participant;
  selected: boolean;
  onSelect: (id: string) => void;
};


function SortableParticipant({
  participant,
  selected,
  onSelect,
}: SortableParticipantProps) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: participant.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };


  return (
    <button
      ref={setNodeRef}
      style={style}
      className={
        "participant-card" +
        (selected ? " selected" : "") +
        (isDragging ? " dragging" : "")
      }
      onClick={() => onSelect(participant.id)}
    >
      <div
        className="drag-handle"
        {...attributes}
        {...listeners}
      >
        ⇅
      </div>

      <span className="participant-name">
        {participant.name}
      </span>

      {participant.id.startsWith("tmp_") && (
        <span
          className="participant-warning"
          title="Participant ID needs to be confirmed"
        />
      )}
    </button>
  );
}