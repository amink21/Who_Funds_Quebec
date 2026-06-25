import { Bar, Doughnut } from 'react-chartjs-2'
import { fmt } from '../utils/formatMoney'
import { shortParty, getPartyColor } from '../utils/partyColors'

const YEAR_ORDER   = ['2019','2020','2021','2022','2023','2024','2025','2026']
const MAIN_PARTIES = ['PQ','CAQ','PLQ','QS']
const MAIN_COLORS  = ['#1a3a6b','#c0392b','#8B0000','#c96a00']

export default function PartiesView({ parties, yearParty, cities, multi, donorDist }) {
  const maxP = parties[0]?.[1] ?? 1

  // Year trend chart
  const yearData = {
    labels: YEAR_ORDER,
    datasets: MAIN_PARTIES.map((p, i) => ({
      label: p,
      data: YEAR_ORDER.map(y => yearParty[y]?.[p] || 0),
      backgroundColor: MAIN_COLORS[i],
      borderRadius: 2,
    })),
  }
  const yearOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { font: { family: 'DM Mono', size: 10 }, boxWidth: 12 } },
      tooltip: { callbacks: { label: c => ` ${c.dataset.label}: ${fmt(c.raw)}` } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { family: 'DM Mono', size: 10 } } },
      y: { grid: { color: '#e8e2d6' }, ticks: { font: { family: 'DM Mono', size: 10 }, callback: v => fmt(v) } },
    },
  }

  // Doughnut
  const PIE_LABELS = ['PQ','CAQ','PLQ','QS','PCQ','Other']
  const PIE_TOTALS = [6773815, 5070181, 4068079, 2811112, 1413511, 2246512]
  const pieTotal   = PIE_TOTALS.reduce((a, b) => a + b, 0)
  const pieData = {
    labels: PIE_LABELS,
    datasets: [{
      data: PIE_TOTALS,
      backgroundColor: ['#1a3a6b','#c0392b','#8B0000','#c96a00','#555','#aaa'],
      borderWidth: 2,
      borderColor: '#f5f0e8',
    }],
  }
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { font: { family: 'DM Mono', size: 11 }, boxWidth: 14 } },
      tooltip: { callbacks: { label: c => ` ${c.label}: ${fmt(c.raw)} (${(c.raw / pieTotal * 100).toFixed(1)}%)` } },
    },
  }

  // Donation size distribution
  const distData = {
    labels: ['$50–100', '$101–200', '$201–300', '$301–500', '$501+'],
    datasets: [{
      label: 'Number of donations',
      data: donorDist ?? [89430, 124600, 31200, 18900, 4080],
      backgroundColor: '#1a3a6b',
      borderRadius: 2,
    }],
  }
  const distOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: c => ` ${c.raw.toLocaleString()} donations` } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { family: 'DM Mono', size: 11 } } },
      y: { grid: { color: '#e8e2d6' }, ticks: { font: { family: 'DM Mono', size: 10 }, callback: v => v.toLocaleString() } },
    },
  }

  const maxCity = cities[0]?.[1] ?? 1

  return (
    <>
      {/* Row 1 — Party bars + Year trend */}
      <div className="grid-2">
        <div className="section">
          <div className="section-label">Top Parties — Total Raised</div>
          {parties.map(([name, total, count, level]) => {
            const pct   = (total / maxP * 100).toFixed(1)
            const badge = level === 'provincial'
              ? <span className="badge prov">PROV</span>
              : <span className="badge mun">MUN</span>
            return (
              <div key={name} className="party-row">
                <div className="party-header">
                  <div className="party-name">{shortParty(name)}{badge}</div>
                  <div className="party-meta">{fmt(total)} · {count.toLocaleString()} donors</div>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${pct}%`, background: getPartyColor(name) }} />
                </div>
              </div>
            )
          })}
        </div>

        <div className="section">
          <div className="section-label">Provincial Donations by Year</div>
          <div className="chart-wrap">
            <Bar data={yearData} options={yearOptions} />
          </div>
          <div style={{ marginTop: 24 }}>
            <div className="section-label">City Breakdown</div>
            {cities.map(([city, total]) => (
              <div key={city} className="city-row">
                <span className="city-name">{city}</span>
                <div className="city-bar">
                  <div className="city-fill" style={{ width: `${(total / maxCity * 100).toFixed(1)}%` }} />
                </div>
                <span className="city-amt">{fmt(total)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 — Doughnut + Multi-party donors */}
      <div className="grid-2">
        <div className="section">
          <div className="section-label">Party Funding Profile — Who Gives More</div>
          <div className="chart-wrap">
            <Doughnut data={pieData} options={pieOptions} />
          </div>
        </div>
        <div className="section">
          <div className="section-label">Donors Who Fund Multiple Parties</div>
          {multi.map(([name, total, ps]) => (
            <div key={name} className="multi-row">
              <div className="multi-name">{name}</div>
              <div className="multi-meta">
                <div className="multi-parties">{ps.slice(0, 3).map(shortParty).join(' · ')}</div>
                <div className="multi-amt">{fmt(total)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3 — Donation size distribution */}
      <div className="grid-2">
        <div className="section">
          <div className="section-label">Donation Size Distribution</div>
          <div className="chart-wrap-lg">
            <Bar data={distData} options={distOptions} />
          </div>
        </div>
        <div className="section">
          <div className="section-label">What the numbers show</div>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 16 }}>
            The majority of Quebec political donations fall in the $101–200 range.
            Quebec law caps individual contributions at $100 per year per political party,
            but donors can give separately to candidates and party entities — pushing many
            totals into the next bracket.
          </p>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.8 }}>
            The long tail of $501+ donations reflects municipal contributions,
            which have a higher cap than their provincial counterparts.
          </p>
        </div>
      </div>
    </>
  )
}
