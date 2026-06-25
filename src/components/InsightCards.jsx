import { useLang } from '../context/LanguageContext'

export default function InsightCards() {
  const { t } = useLang()
  return (
    <div className="insights">
      {t.insights.map(c => (
        <div key={c.label} className="insight">
          <div className="insight-num">{c.num}</div>
          <div className="insight-label">{c.label}</div>
          <div className="insight-desc">{c.desc}</div>
        </div>
      ))}
    </div>
  )
}
