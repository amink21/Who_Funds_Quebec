import { useState, useEffect, useRef } from 'react'
import { LanguageProvider } from './context/LanguageContext'
import Masthead from './components/Masthead'
import Ticker from './components/Ticker'
import StatsBar from './components/StatsBar'
import InsightCards from './components/InsightCards'
import NavTabs from './components/NavTabs'
import MapView from './components/MapView'
import PartiesView from './components/PartiesView'
import SearchView from './components/SearchView'
import AboutView from './components/AboutView'
import Footer from './components/Footer'

export default function App() {
  const [data, setData]       = useState(null)
  const [activeTab, setActiveTab] = useState('map')
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const aboveMapRef = useRef(null)

  // Lock scroll on map tab (including iOS Safari bounce prevention)
  useEffect(() => {
    const on = activeTab === 'map'
    document.body.style.overflow            = on ? 'hidden' : ''
    document.body.style.overscrollBehavior  = on ? 'none'   : ''
    document.documentElement.style.overflow = on ? 'hidden' : ''
    return () => {
      document.body.style.overflow            = ''
      document.body.style.overscrollBehavior  = ''
      document.documentElement.style.overflow = ''
    }
  }, [activeTab])

  useEffect(() => {
    fetch('/data.json')
      .then(r => {
        if (!r.ok) throw new Error('data.json not found')
        return r.json()
      })
      .then(d => { setData(d); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  if (loading) return (
    <div style={{ background: '#f5f0e8', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', letterSpacing: '2px', color: '#6b6b6b' }}>
        LOADING DATA...
      </div>
    </div>
  )

  if (error) return (
    <div style={{ padding: '40px', fontFamily: 'DM Mono, monospace', fontSize: '13px', color: '#c0392b' }}>
      <strong>Error:</strong> {error}
      <br /><br />
      Run <code>python scripts/preprocess.py</code> from the project root to generate the data files.
    </div>
  )

  return (
    <LanguageProvider>
    <>
      <div ref={aboveMapRef}>
        <Masthead />
        <Ticker />
        <StatsBar summary={data.summary} />
        <InsightCards />
        <NavTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      <div style={{ flex: 1 }}>
        {activeTab === 'map'     && <MapView mapPoints={data.mapPoints} aboveRef={aboveMapRef} />}
        {activeTab === 'parties' && (
          <PartiesView
            parties={data.parties}
            yearParty={data.yearParty}
            cities={data.cities}
            multi={data.multi}
            donorDist={data.donorDist}
          />
        )}
        {activeTab === 'search'  && <SearchView />}
        {activeTab === 'about'   && <AboutView />}
      </div>
      {activeTab !== 'map' && <Footer />}
    </>
    </LanguageProvider>
  )
}
