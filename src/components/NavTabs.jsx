const TABS = [
  { id: 'map',     label: '🗺 Map' },
  { id: 'parties', label: '💰 Parties' },
  { id: 'search',  label: '🔍 Search' },
]

export default function NavTabs({ activeTab, onTabChange }) {
  return (
    <div className="nav-tabs">
      {TABS.map(t => (
        <div
          key={t.id}
          className={`nav-tab${activeTab === t.id ? ' active' : ''}`}
          onClick={() => onTabChange(t.id)}
        >
          {t.label}
        </div>
      ))}
    </div>
  )
}
