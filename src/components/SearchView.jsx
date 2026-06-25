import { useState, useEffect, useRef } from 'react'
import Fuse from 'fuse.js'
import { fmt } from '../utils/formatMoney'
import { useLang } from '../context/LanguageContext'

export default function SearchView() {
  const { t } = useLang()
  const [query, setQuery]       = useState('')
  const [results, setResults]   = useState([])
  const [status, setStatus]     = useState('idle') // idle | loading | ready | error
  const fuseRef = useRef(null)

  useEffect(() => {
    setStatus('loading')
    fetch('/search_donors.json')
      .then(r => {
        if (!r.ok) throw new Error('not found')
        return r.json()
      })
      .then(donors => {
        fuseRef.current = new Fuse(donors, {
          keys: ['n'],
          threshold: 0.35,
          distance: 100,
          minMatchCharLength: 2,
        })
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [])

  const handleSearch = e => {
    const q = e.target.value
    setQuery(q)
    if (q.length < 2 || !fuseRef.current) {
      setResults([])
      return
    }
    const hits = fuseRef.current.search(q, { limit: 15 })
    setResults(hits.map(h => h.item))
  }

  return (
    <>
      <div className="search-wrap">
        <div className="search-label">{t.search.label}</div>
        <input
          className="search-input"
          type="text"
          placeholder={t.search.placeholder}
          value={query}
          onChange={handleSearch}
          disabled={status === 'loading'}
        />
        {status === 'loading' && (
          <div style={{ marginTop: 10, fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#6b6b6b', letterSpacing: '1px' }}>
            {t.search.loading}
          </div>
        )}
        {status === 'error' && (
          <div style={{ marginTop: 10, fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#c0392b' }}>
            {t.search.error}
          </div>
        )}
        <div className="search-results">
          {results.map((d, i) => (
            <div key={i} className="s-row">
              <span className="s-name">{d.n}</span>
              <span className="s-party">{d.p?.join(', ')}</span>
              <span className="s-amt">{fmt(d.t)}</span>
            </div>
          ))}
          {query.length >= 2 && results.length === 0 && status === 'ready' && (
            <div style={{ fontSize: 12, color: '#888', padding: '8px 0', fontFamily: 'DM Mono, monospace' }}>
              {t.search.noResults} &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      </div>

      <div className="section" style={{ border: 'none', padding: '28px' }}>
        <div className="section-label">{t.search.howToUse}</div>
        <p style={{ fontSize: 13, color: '#6b6b6b', lineHeight: 1.8, maxWidth: 600 }}>
          {t.search.howToDesc}
          <br /><br />
          {t.search.trySearcing} <strong>Tremblay</strong>, <strong>Gagnon</strong>, <strong>Roy</strong>, <strong>Bouchard</strong>
        </p>
      </div>
    </>
  )
}
