export default function ProgressTracker({ objectives, getProgress }) {
  return (
    <div className="tracker">
      <div className="tracker-grid">
        {objectives.map(obj => {
          const progress = getProgress(obj.id)
          return (
            <div
              key={obj.id}
              className="tracker-card"
              style={{ borderLeftColor: obj.color }}
            >
              <div className="tracker-card-title">{obj.title}</div>
              <div className="tracker-progress">
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${progress.percent}%`,
                      background: obj.color,
                    }}
                  />
                </div>
                <span className="progress-text" style={{ color: obj.color }}>
                  {progress.percent}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
