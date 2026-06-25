import { useLang } from '../context/LanguageContext'

export default function Footer() {
  const { t } = useLang()
  return (
    <div className="footer">
      <div className="footer-l">{t.footer.left}</div>
      <div className="footer-r">{t.footer.right}</div>
    </div>
  )
}
