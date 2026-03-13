export default function Header({ title, subtitle, view, onViewChange, onReset }) {
  return (
    <header className="app-header">
      <div className="header-top">
        <div>
          <div className="logo">delaware</div>
        </div>
        <div className="view-tabs">
          <button
            className={`view-tab ${view === 'board' ? 'active' : ''}`}
            onClick={() => onViewChange('board')}
          >
            Board
          </button>
          <button
            className={`view-tab ${view === 'overview' ? 'active' : ''}`}
            onClick={() => onViewChange('overview')}
          >
            Overview
          </button>
          <button className="view-tab" onClick={onReset} title="Reset to YAML defaults">
            Reset
          </button>
        </div>
      </div>
      <h1 className="header-title">{title}</h1>
      <p className="header-subtitle">{subtitle}</p>
    </header>
  )
}
