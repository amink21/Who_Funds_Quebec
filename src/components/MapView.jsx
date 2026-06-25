import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { PARTY_COLORS } from '../utils/partyColors'
import { fmt } from '../utils/formatMoney'
import { useLang } from '../context/LanguageContext'

const TOKEN = 'eyJraWQiOiJZTUtZUVJBVTVOIiwidHlwIjoiSldUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJaMldDMktLOTZYIiwiaWF0IjoxNzgyNDAyNTk3LCJzY29wZSI6Im1hcGtpdF9qcyIsImV4cCI6MTc4MzA2MTk5OX0.u-l0S30_Eir2rNpR70zm8hW5tWga_zam4bqPu_pyOAryZ1V3O5YFdDt08_vbumzP_JGsatdGwdqbDNJ_R8WH2g'

const LEGEND = [
  ['PQ',          '#1a3a6b'],
  ['CAQ',         '#c0392b'],
  ['PLQ',         '#8B0000'],
  ['QS',          '#c96a00'],
  ['Projet MTL',  '#1d6b3b'],
  ['PCQ / Other', '#555555'],
]

export default function MapView({ mapPoints, aboveRef }) {
  const { t } = useLang()
  const containerRef = useRef(null)
  const mapRef       = useRef(null)
  const selectRef    = useRef(null)
  const [selected, setSelected] = useState(null)
  const [mkReady, setMkReady]   = useState(!!window.mapkit)
  const [mapHeight, setMapHeight] = useState(window.innerHeight - 600)

  selectRef.current = setSelected

  // Measure the elements above the map to get an exact fill height
  useLayoutEffect(() => {
    const measure = () => {
      const aboveH = aboveRef?.current?.getBoundingClientRect().height ?? 600
      setMapHeight(Math.max(320, window.innerHeight - aboveH))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [aboveRef])

  // Wait for MapKit JS CDN script
  useEffect(() => {
    if (window.mapkit) { setMkReady(true); return }
    const id = setInterval(() => {
      if (window.mapkit) { clearInterval(id); setMkReady(true) }
    }, 50)
    return () => clearInterval(id)
  }, [])

  // Build map once ready
  useEffect(() => {
    if (!mkReady || !mapPoints?.length || !containerRef.current || mapRef.current) return

    const mk = window.mapkit

    if (!window.__mapkitInited) {
      mk.init({ authorizationCallback: done => done(TOKEN) })
      window.__mapkitInited = true
    }

    const map = new mk.Map(containerRef.current, {
      region: new mk.CoordinateRegion(
        new mk.Coordinate(47.0, -72.5),
        new mk.CoordinateSpan(8, 10)
      ),
      colorScheme:           mk.Map.ColorSchemes.Light,
      mapType:               mk.Map.MapTypes.Standard,
      showsCompass:          mk.FeatureVisibility.Hidden,
      showsScale:            mk.FeatureVisibility.Hidden,
      showsZoomControl:      false,
      showsMapTypeControl:   false,
      isRotationEnabled:     false,
    })
    mapRef.current = map

    const maxTotal = Math.max(...mapPoints.map(p => p.total))

    const annotations = mapPoints.map(pt => {
      const color = PARTY_COLORS[pt.top_party] || '#888'
      const size  = Math.max(6, Math.sqrt(pt.total / maxTotal) * 52)

      const factory = () => {
        const div = document.createElement('div')
        const shadow = `0 2px 8px ${color}88, 0 1px 3px rgba(0,0,0,0.18)`
        Object.assign(div.style, {
          width:        `${size}px`,
          height:       `${size}px`,
          borderRadius: '50%',
          background:   color,
          border:       '2px solid rgba(255,255,255,0.92)',
          cursor:       'pointer',
          boxSizing:    'border-box',
          opacity:      '0.82',
          boxShadow:    shadow,
          transition:   'transform 0.15s cubic-bezier(0.34,1.56,0.64,1), opacity 0.15s',
        })
        div.addEventListener('mouseenter', () => { div.style.transform = 'scale(1.35)'; div.style.opacity = '1' })
        div.addEventListener('mouseleave', () => { div.style.transform = 'scale(1)';    div.style.opacity = '0.82' })
        div.addEventListener('click', e => {
          e.stopPropagation()
          selectRef.current(prev => prev?.fsa === pt.fsa ? null : pt)
        })
        return div
      }

      return new mk.Annotation(
        new mk.Coordinate(pt.lat, pt.lng),
        factory,
        { calloutEnabled: false, anchorOffset: new DOMPoint(0, 0), data: pt }
      )
    })

    map.addAnnotations(annotations)
    map.element.addEventListener('click', () => selectRef.current(null))

    return () => { map.destroy(); mapRef.current = null }
  }, [mkReady, mapPoints])

  return (
    <div style={{ position: 'relative', height: mapHeight, background: '#e8e4db' }}>
      {/* Map canvas */}
      <div ref={containerRef} style={{ position: 'absolute', inset: 0 }} />

      {/* Loading */}
      {!mkReady && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 5,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'DM Mono, monospace', fontSize: 11, letterSpacing: '2px', color: '#6b6b6b',
        }}>
          {t.map.loading}
        </div>
      )}

      {/* Detail popup */}
      {selected && (
        <div className="map-detail-card">
          <div className="map-detail-top">
            <span className="map-detail-fsa">{selected.fsa}</span>
            <div className="map-detail-totals">
              <span className="map-detail-amount">{fmt(selected.total)}</span>
              <span className="map-detail-count">{selected.count.toLocaleString()} {t.map.donations}</span>
            </div>
            <button className="map-detail-close" onClick={() => setSelected(null)}>×</button>
          </div>
          <div className="map-detail-parties">
            {Object.entries(selected.parties).slice(0, 6).map(([p, v]) => (
              <div key={p} className="map-detail-pill">
                <div className="map-detail-dot" style={{ background: PARTY_COLORS[p] || '#888' }} />
                <span style={{ color: PARTY_COLORS[p] || '#888' }}>{p}</span>
                <span className="map-detail-pill-amt">{fmt(v)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend — overlaid at bottom of map */}
      <div className="map-legend-bar">
        <span className="leg-label">{t.map.legendLabel}</span>
        {LEGEND.map(([label, color]) => (
          <div key={label} className="leg-item">
            <div className="leg-dot" style={{ background: color }} />
            <span>{label}</span>
          </div>
        ))}
        <span className="leg-hint">{t.map.legendHint}</span>
      </div>
    </div>
  )
}
