const FACTS = [
  'PQ raised $6.7M from 80,514 donors',
  'CAQ raised $5.1M from 49,522 donors',
  '12,046 donors gave to BOTH provincial AND municipal parties',
  '6,769 donors gave to 3+ different parties',
  'Westmount (H3Y) donors gave $189k — 98% went to PLQ',
  '2022 provincial election year: $5.3M raised — 2.5× normal',
  '2021 municipal election year: $5.6M raised — 6× normal',
  'Montréal donors gave $7.1M total',
  'Stéphane Boyer (Laval mayor) donated $2,400 to his own party',
  'Luc Rabouin (Projet Montréal leader) is the top municipal donor at $3,600',
]

export default function Ticker() {
  const text = FACTS.join('   ·   ')
  return (
    <div className="ticker">
      <span className="ticker-inner">&nbsp;&nbsp;&nbsp;{text}&nbsp;&nbsp;&nbsp;</span>
    </div>
  )
}
