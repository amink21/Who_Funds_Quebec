import { fmt } from '../utils/formatMoney'

export default function StatsBar({ summary }) {
  const totalDonations = summary?.total_donations?.toLocaleString() ?? '289,374'
  const totalAmount    = summary ? fmt(summary.total_amount) : '$30.4M'
  const uniqueDonors   = summary?.unique_donors?.toLocaleString() ?? '108,216'
  const yearRange      = summary ? `${summary.year_min}–${String(summary.year_max).slice(2)}` : '2019–26'

  return (
    <div className="stats-bar">
      <div className="stat-cell">
        <div className="stat-num">{totalAmount}</div>
        <div className="stat-label">Total Donated</div>
      </div>
      <div className="stat-cell">
        <div className="stat-num">{totalDonations}</div>
        <div className="stat-label">Donations</div>
      </div>
      <div className="stat-cell">
        <div className="stat-num">{uniqueDonors}</div>
        <div className="stat-label">Unique Donors</div>
      </div>
      <div className="stat-cell">
        <div className="stat-num">{yearRange}</div>
        <div className="stat-label">7 Years of Data</div>
      </div>
    </div>
  )
}
