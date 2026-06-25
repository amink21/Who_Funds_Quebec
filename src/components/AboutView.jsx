export default function AboutView() {
  return (
    <div className="about-wrap">

      <div className="about-hero">
        <div className="about-kicker">About this project</div>
        <h2 className="about-headline">
          Money is the oxygen of politics.<br />
          <em>We mapped where it comes from.</em>
        </h2>
      </div>

      <div className="about-body">

        <div className="about-section">
          <h3>The data</h3>
          <p>
            Every donation of $50 or more made to a Quebec political party must be publicly
            disclosed by law — both at the provincial level under the <em>Election Act</em> and
            at the municipal level under the <em>Act respecting elections and referendums in
            municipalities</em>. Élections Québec publishes this registry as downloadable CSV
            files, updated regularly.
          </p>
          <p>
            We downloaded both files directly from the official registry — no scraping,
            no third parties. The raw data covers <strong>289,374 individual transactions</strong>{' '}
            totalling <strong>$30.4 million</strong> donated between 2019 and 2026, from{' '}
            <strong>108,216 unique donors</strong> across Quebec.
          </p>
        </div>

        <div className="about-section">
          <h3>How it works</h3>
          <p>
            A Python script reads both CSV files (Latin-1 encoded, semicolon-delimited — exactly
            as Élections Québec exports them), normalises party names, groups donations by postal
            code and year, and writes two compact JSON files. The entire pipeline runs in under
            10 seconds and requires nothing beyond Python's standard library.
          </p>
          <p>
            The app itself is a static React site. No server. No database. No API calls after
            the page loads. The 80 KB summary file powers the map and charts; a 7 MB donor index
            powers the fuzzy search. Everything runs in your browser.
          </p>
        </div>

        <div className="about-section">
          <h3>The map</h3>
          <p>
            Quebec is divided into 383 Forward Sortation Areas — the first three characters of
            a Canadian postal code (e.g. <strong>H3Y</strong> for Westmount,{' '}
            <strong>G1R</strong> for Old Quebec City). We use these as our unit of geography
            because they strike the right balance: granular enough to reveal neighbourhood-level
            patterns, broad enough that every area has meaningful data.
          </p>
          <p>
            Each dot's size is proportional to the square root of total donations from that area —
            so Montreal doesn't completely swamp the rest of the province. The colour reflects
            whichever party received the most money from that FSA.
          </p>
        </div>

        <div className="about-section">
          <h3>Why we built this</h3>
          <p>
            Political donations are public for a reason. They reveal the financial relationships
            between citizens and the parties that govern them — who funds whom, which
            neighbourhoods skew hard to one party, and which donors spread money across multiple
            parties at once.
          </p>
          <p>
            That data has always been technically available. But raw CSVs with 289,000 rows
            aren't accessible to most people. This project exists to change that.
          </p>
        </div>

        <div className="about-meta">
          <div className="about-meta-row">
            <span className="about-meta-label">Data source</span>
            <span>Élections Québec — Public Donor Registry</span>
          </div>
          <div className="about-meta-row">
            <span className="about-meta-label">Coverage</span>
            <span>2019 – 2026 · Provincial &amp; Municipal</span>
          </div>
          <div className="about-meta-row">
            <span className="about-meta-label">Minimum donation</span>
            <span>$50 (below this threshold, donations are not disclosed)</span>
          </div>
          <div className="about-meta-row">
            <span className="about-meta-label">Tech stack</span>
            <span>React · Vite · Apple MapKit JS · Chart.js · Fuse.js · Python</span>
          </div>
          <div className="about-meta-row">
            <span className="about-meta-label">License</span>
            <span>Code: MIT · Data: public record (CC-BY, Élections Québec)</span>
          </div>
        </div>

      </div>
    </div>
  )
}
