import { useState, useEffect, useRef } from 'react'
import Fuse from 'fuse.js'
import { fmt } from '../utils/formatMoney'

export default function SearchView() {
  const [query, setQuery]       = useState('')
  const [results, setResults]   = useState([])
  const [status, setStatus]     = useState('idle') // idle | loading | ready | error
  const fuseRef = useRef(null)

  useEffect(() => {
    setStatus('loading')
    fetch('/search_donors.json')
      .then(r => {
        if (!r.ok) throw new Error('search_donors.json not found')
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
        <div className="search-label">Search any donor</div>
        <input
          className="search-input"
          type="text"
          placeholder="Type a name, e.g. Tremblay..."
          value={query}
          onChange={handleSearch}
          disabled={status === 'loading'}
        />
        {status === 'loading' && (
          <div style={{ marginTop: 10, fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#6b6b6b', letterSpacing: '1px' }}>
            LOADING DONOR DATABASE...
          </div>
        )}
        {status === 'error' && (
          <div style={{ marginTop: 10, fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#c0392b' }}>
            Donor search is unavailable — the search index was not included in this deployment.
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
              No donors found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      </div>

      <div className="section" style={{ border: 'none', padding: '28px' }}>
        <div className="section-label">How to use</div>
        <p style={{ fontSize: 13, color: '#6b6b6b', lineHeight: 1.8, maxWidth: 600 }}>
          Search any Quebec resident&rsquo;s name to see their political donation history across both provincial and
          municipal parties. All data is public record under Quebec&rsquo;s Election Act. Names, amounts, cities,
          and parties are all disclosed.
          <br /><br />
          Try searching: <strong>Tremblay</strong>, <strong>Gagnon</strong>, <strong>Roy</strong>, <strong>Bouchard</strong>
        </p>
      </div>
    </>
  )
}
