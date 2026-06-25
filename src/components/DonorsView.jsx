import { Bar } from 'react-chartjs-2'
import { fmt } from '../utils/formatMoney'
import { shortParty } from '../utils/partyColors'

export default function DonorsView({ donors, donorDist }) {
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

  return (
    <div className="grid-2">
      <div className="section">
        <div className="section-label">Top 20 Donors — All Time</div>
        {donors.map(([name, total, ps], i) => (
          <div key={name + i} className="donor-row">
            <span className="d-rank">{i + 1}</span>
            <span className="d-name">{name}</span>
            <span className="d-parties">
              {ps.slice(0, 2).map(shortParty).join('\n')}
            </span>
            <span className="d-amount">{fmt(total)}</span>
          </div>
        ))}
      </div>

      <div className="section">
        <div className="section-label">Donation Size Distribution</div>
        <div className="chart-wrap-lg">
          <Bar data={distData} options={distOptions} />
        </div>
      </div>
    </div>
  )
}
