export default function Card({ milestone, isDragging }) {
  const noteCount = (milestone.notes || []).length
  return (
    <div className={`card ${isDragging ? 'dragging' : ''}`}>
      <div
        className="card-color-bar"
        style={{ background: milestone.objective.color }}
      />
      <span
        className="card-objective-tag"
        style={{ background: milestone.objective.color }}
      >
        {milestone.objective.title}
      </span>
      <div className="card-title">{milestone.title}</div>
      <div className="card-description">{milestone.description}</div>
      {noteCount > 0 && (
        <div className="card-footer">
          <span className="card-notes-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {noteCount}
          </span>
        </div>
      )}
    </div>
  )
}
