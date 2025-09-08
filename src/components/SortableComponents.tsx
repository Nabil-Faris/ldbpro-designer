import React, { useState } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { PageComponent } from '../types';
import ComponentPreview from './ComponentPreview';
import { COMPONENT_SCHEMAS } from '../types';

type Item = { id: string; component: PageComponent };

type Props = {
  items: PageComponent[];
  onReorder: (next: PageComponent[]) => void;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
};

export default function SortableComponents({ items, onReorder, onEdit, onDelete, onMoveUp, onMoveDown }: Props) {
  const itemWithIds: Item[] = items.map((c) => ({ id: c.id, component: c }));
  const ids = itemWithIds.map((i) => i.id);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={(event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = ids.indexOf(String(active.id));
        const newIndex = ids.indexOf(String(over.id));
        onReorder(arrayMove(items, oldIndex, newIndex));
      }}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div style={{ display: 'grid', gap: 16 }}>
          {itemWithIds.map(({ id, component }, index) => (
            <SortableItem
              key={id}
              id={id}
              component={component}
              onClick={() => onEdit(index)}
              onDelete={() => onDelete(index)}
              onMoveUp={() => onMoveUp(index)}
              onMoveDown={() => onMoveDown(index)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableItem({ id, component, onClick, onDelete, onMoveUp, onMoveDown }: {
  id: string;
  component: PageComponent;
  onClick: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const [isExiting, setIsExiting] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    padding: 20,
    borderRadius: 14,
    background: 'linear-gradient(180deg, rgba(26, 29, 36, 0.75), rgba(20, 23, 30, 0.75))',
    border: '1px solid rgba(120, 130, 150, 0.22)',
    position: 'relative',
  };

  return (
    <div ref={setNodeRef} style={style} onClick={onClick} className={isExiting ? 'card-exit' : undefined}>
      <div className="card-actions">
        <button
          type="button"
          className="btn btn-ghost btn-mini"
          style={{ cursor: 'grab' }}
          onClick={(e) => e.stopPropagation()}
          {...attributes}
          {...listeners}
        >
          ☰
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-mini"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          Éditer
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-mini"
          onClick={(e) => {
            e.stopPropagation();
            onMoveUp();
          }}
        >
          ↑
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-mini"
          onClick={(e) => {
            e.stopPropagation();
            onMoveDown();
          }}
        >
          ↓
        </button>
        <button
          type="button"
          className="btn btn-danger btn-mini"
          onClick={(e) => {
            e.stopPropagation();
            if (isExiting) return;
            setIsExiting(true);
            setTimeout(() => onDelete(), 240);
          }}
        >
          Supprimer
        </button>
      </div>
      <h3 className="card-title" style={{ marginBottom: 12 }}>{COMPONENT_SCHEMAS[component.type].name}</h3>
      <ComponentPreview component={component} />
    </div>
  );
}

