import Column from './Column'

export default function Board({ columns, getMilestonesByStatus, onCardClick }) {
  return (
    <div className="board">
      {columns.map(col => (
        <Column
          key={col.id}
          column={col}
          milestones={getMilestonesByStatus(col.id)}
          onCardClick={onCardClick}
        />
      ))}
    </div>
  )
}
