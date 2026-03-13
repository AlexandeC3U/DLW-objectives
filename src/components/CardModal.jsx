import { useState, useEffect } from 'react'

export default function CardModal({
  milestone,
  columns,
  onClose,
  onStatusChange,
  onAddNote,
  onDeleteNote,
  allMilestones,
}) {
  const [noteText, setNoteText] = useState('')

  // Get fresh milestone data from allMilestones
  const fresh = allMilestones.find(m => m.id === milestone.id) || milestone
  const notes = fresh.notes || []

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [onClose])

  const handleAddNote = (e) => {
    e.preventDefault()
    const trimmed = noteText.trim()
    if (!trimmed) return
    onAddNote(trimmed)
    setNoteText('')
  }

  const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <div className="modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose()
    }}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-header-content">
            <span
              className="modal-objective-tag"
              style={{ background: fresh.objective.color }}
            >
              {fresh.objective.title}
            </span>
            <h2 className="modal-title">{fresh.title}</h2>
            <p className="modal-description">{fresh.description}</p>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {/* Status */}
          <div className="modal-section">
            <div className="modal-section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              Status
            </div>
            <div className="status-selector">
              {columns.map(col => (
                <button
                  key={col.id}
                  className={`status-option ${fresh.status === col.id ? 'active' : ''}`}
                  data-status={col.id}
                  onClick={() => onStatusChange(col.id)}
                >
                  {col.title}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="modal-section">
            <div className="modal-section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Notes ({notes.length})
            </div>
            {notes.length > 0 ? (
              <div className="notes-list">
                {notes.map(note => (
                  <div key={note.id} className="note-item">
                    <div className="note-text">{note.text}</div>
                    <div className="note-timestamp">{formatDate(note.timestamp)}</div>
                    <button
                      className="note-delete"
                      onClick={() => onDeleteNote(note.id)}
                      title="Delete note"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-notes">No notes yet. Add one below.</p>
            )}
            <form className="add-note-form" onSubmit={handleAddNote}>
              <textarea
                className="add-note-input"
                placeholder="Write a note..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={2}
              />
              <button
                type="submit"
                className="add-note-btn"
                disabled={!noteText.trim()}
              >
                Add
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
