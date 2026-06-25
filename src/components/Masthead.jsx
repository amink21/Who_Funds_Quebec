import { useLang } from '../context/LanguageContext'

export default function Masthead() {
  const { lang, setLang, t } = useLang()
  return (
    <div className="masthead">
      <button
        className="lang-toggle"
        onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
        aria-label="Switch language"
      >
        {t.masthead.toggle}
      </button>
      <div className="eyebrow">{t.masthead.eyebrow}</div>
      <h1>{t.masthead.titleMain} <em>{t.masthead.titleEm}</em></h1>
      <div className="masthead-sub">{t.masthead.sub}</div>
    </div>
  )
}
