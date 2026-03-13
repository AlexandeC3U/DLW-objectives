import { Droppable, Draggable } from '@hello-pangea/dnd'
import Card from './Card'

export default function Column({ column, milestones, onCardClick }) {
  return (
    <div className="column" data-status={column.id}>
      <div className="column-header">
        <span className="column-title">{column.title}</span>
        <span className="column-count">{milestones.length}</span>
      </div>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`column-body ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
          >
            {milestones.map((milestone, index) => (
              <Draggable
                key={milestone.id}
                draggableId={milestone.id}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onCardClick(milestone)}
                  >
                    <Card
                      milestone={milestone}
                      isDragging={snapshot.isDragging}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  )
}
