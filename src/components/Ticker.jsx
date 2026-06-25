import { useLang } from '../context/LanguageContext'

export default function Ticker() {
  const { t } = useLang()
  const text = t.ticker.facts.join('   ·   ')
  return (
    <div className="ticker">
      <span className="ticker-inner">&nbsp;&nbsp;&nbsp;{text}&nbsp;&nbsp;&nbsp;</span>
    </div>
  )
}
