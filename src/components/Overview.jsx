export default function Overview({ objectives, getProgress, onMilestoneClick, getAllMilestones }) {
  const allMilestones = getAllMilestones()

  return (
    <div className="overview">
      <div className="overview-grid">
        {objectives.map((obj, idx) => {
          const progress = getProgress(obj.id)
          return (
            <div key={obj.id} className="objective-card">
              <div
                className="objective-card-header"
                style={{ background: `linear-gradient(135deg, ${obj.color}, ${obj.color}dd)` }}
              >
                <span className="objective-card-number">{idx + 1}</span>
                <div className="objective-card-title">{obj.title}</div>
                <div className="objective-card-subtitle">{obj.subtitle}</div>
              </div>
              <div className="objective-card-body">
                <p className="objective-card-desc">{obj.description}</p>
                <ul className="milestone-list">
                  {obj.milestones.map(m => {
                    const freshM = allMilestones.find(am => am.id === m.id) || { ...m, objective: obj }
                    return (
                      <li
                        key={m.id}
                        className="milestone-row"
                        style={{ cursor: 'pointer' }}
                        onClick={() => onMilestoneClick(freshM)}
                      >
                        <span className={`milestone-status-dot ${freshM.status}`} />
                        <span className="milestone-row-title">{m.title}</span>
                        <span className="milestone-row-status">{freshM.status.replace('-', ' ')}</span>
                      </li>
                    )
                  })}
                </ul>
                <div className="tracker-progress" style={{ marginTop: 12 }}>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${progress.percent}%`, background: obj.color }}
                    />
                  </div>
                  <span className="progress-text" style={{ color: obj.color }}>
                    {progress.done}/{progress.total}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
