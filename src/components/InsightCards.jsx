const CARDS = [
  {
    num: '6,769',
    label: 'Political hedgers',
    desc: 'Donors who gave money to 3 or more different parties — spreading influence across the political spectrum.',
  },
  {
    num: '12,046',
    label: 'Dual-level donors',
    desc: 'People who donated to both provincial AND municipal parties — the most politically active Quebecers.',
  },
  {
    num: '98%',
    label: 'Westmount → PLQ',
    desc: 'Of all donations from the H3Y postal code (Westmount), 98% went to the Quebec Liberal Party.',
  },
]

export default function InsightCards() {
  return (
    <div className="insights">
      {CARDS.map(c => (
        <div key={c.label} className="insight">
          <div className="insight-num">{c.num}</div>
          <div className="insight-label">{c.label}</div>
          <div className="insight-desc">{c.desc}</div>
        </div>
      ))}
    </div>
  )
}
