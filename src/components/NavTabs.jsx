import { useLang } from '../context/LanguageContext'

export default function NavTabs({ activeTab, onTabChange }) {
  const { t } = useLang()
  const TABS = [
    { id: 'map',     label: t.tabs.map },
    { id: 'parties', label: t.tabs.parties },
    { id: 'search',  label: t.tabs.search },
    { id: 'about',   label: t.tabs.about },
  ]
  return (
    <div className="nav-tabs">
      {TABS.map(tab => (
        <div
          key={tab.id}
          className={`nav-tab${activeTab === tab.id ? ' active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  )
}
