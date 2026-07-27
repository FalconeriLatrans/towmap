import "./ParticipantsList.css";
import { useEffect, useState } from "react";
import type { Participant } from "../../../types/Participant";

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
  onMove: (
    participantId: string,
    previousId: string | null,
    nextId: string | null
  ) => void;
  dragEnabled?: boolean;
};


export default function ParticipantsList({
  participants,
  selectedId,
  onSelect,
  onMove,
  dragEnabled = true,
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
      const oldIndex = currentItems.findIndex(participant =>participant.id === active.id);
      const newIndex = currentItems.findIndex(participant =>participant.id === over.id);
  
      if (oldIndex === -1 || newIndex === -1) {
        return currentItems;
      }
  
      const reorderedItems = arrayMove(
        currentItems,
        oldIndex,
        newIndex
      );
  
      const movedIndex =
        reorderedItems.findIndex(
          participant =>
            participant.id === active.id
        );
  
      const previousParticipant =reorderedItems[movedIndex - 1] ?? null;
      const nextParticipant =reorderedItems[movedIndex + 1] ?? null;
  
      onMove(
        String(active.id),
        previousParticipant?.id ?? null,
        nextParticipant?.id ?? null
      );
  
      return reorderedItems;
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
              selected={participant.id === selectedId}
              onSelect={onSelect}
              dragEnabled = {dragEnabled}
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
  dragEnabled,
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
    disabled: !dragEnabled,
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
      {dragEnabled && (
      <div
        className="drag-handle"
        {...attributes}
        {...listeners}
      >
        ⇅
      </div>
      )}

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