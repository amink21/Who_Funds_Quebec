# Who Funds Quebec?

> **289,374 political donations · $30.4M raised · 108,216 donors · 2019–2026**

An interactive data visualization of every disclosed political contribution made in Quebec from 2019 to 2026 — both provincial and municipal. Built as a static React app with no backend: just a Python preprocessing script and a JSON file.

Data source: [Élections Québec Public Donor Registry](https://www.electionsquebec.qc.ca/en/financing-expenses-and-contributions/research-on-contributors/) — public record under Quebec's *Election Act*.

---

## Features

- **Interactive map** — 383 Forward Sortation Areas (FSAs) plotted with Apple MapKit JS. Circle size = total donations, colour = dominant party. Click any dot for a breakdown.
- **Parties tab** — party funding bars, year-over-year trends, donation size distribution, and top multi-party donors.
- **Search tab** — fuzzy-search across all 108,216 unique donors by name. Results show party affiliations and total donated.
- **Ticker** — scrolling highlights (top municipal donor, election year anomalies, etc.)
- **Fully responsive** — works on desktop, tablet, and mobile. Map tab locks scroll so the map fills the viewport.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18 + Vite 5 |
| Map | [Apple MapKit JS](https://developer.apple.com/maps/web/) (CDN) |
| Charts | Chart.js 4 + react-chartjs-2 |
| Search | Fuse.js 7 (in-browser fuzzy search) |
| Data pipeline | Python 3 (stdlib only — `csv`, `json`) |
| Styling | Plain CSS (no framework) |
| Fonts | Libre Baskerville + DM Mono (Google Fonts) |

No database. No server. No API. The entire dataset ships as two static JSON files built by the preprocessing script.

---

## Project Structure

```
who-funds-quebec/
├── index.html                          # App shell — loads MapKit JS CDN
├── vite.config.js
├── package.json
│
├── scripts/
│   └── preprocess.py                   # CSV → JSON pipeline (run this first)
│
├── public/
│   ├── data.json                       # 80 KB — map points, charts, summaries (committed)
│   └── search_donors.json             # 7 MB  — all donors for fuzzy search (committed)
│
└── src/
    ├── main.jsx                        # Entry point
    ├── App.jsx                         # Root — fetches data.json, manages tabs
    ├── index.css                       # All styles (responsive, no CSS framework)
    │
    ├── components/
    │   ├── Masthead.jsx                # Header / title
    │   ├── Ticker.jsx                  # Scrolling news-style highlights
    │   ├── StatsBar.jsx                # 4-cell summary bar
    │   ├── InsightCards.jsx            # 3 data callout cards
    │   ├── NavTabs.jsx                 # Map / Parties / Search tabs
    │   ├── MapView.jsx                 # Apple MapKit JS map with FSA annotations
    │   ├── PartiesView.jsx             # Bar charts, doughnut, distribution, multi-donors
    │   ├── SearchView.jsx              # Fuse.js donor search
    │   └── Footer.jsx
    │
    └── utils/
        ├── partyColors.js              # Party → hex colour + short-code helpers
        ├── formatMoney.js              # fmt() — $1.2M / $340k / $50
        └── chartSetup.js              # Global Chart.js component registration
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.8+

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/who-funds-quebec.git
cd who-funds-quebec
```

### 2. Download the source data

The raw CSV files are not committed (29 MB combined). Download them from Élections Québec:

| File | URL |
| --- | --- |
| Provincial contributions | https://www.electionsquebec.qc.ca/en/political-financing/political-donations/ |
| Municipal contributions | Same page — download both CSV exports |

Save them to the project root as:

```
contributions-pro-en.csv
contributions-mun-en.csv
```

The files use Latin-1 encoding, semicolon delimiters, and skip two header lines — the preprocessor handles all of this automatically.

### 3. Run the preprocessing script

```bash
python scripts/preprocess.py
```

This reads both CSVs and writes:
- `public/data.json` — 80 KB summary used by the map and charts
- `public/search_donors.json` — 7 MB donor index used by the search tab (both files are committed)

Runtime: ~5–10 seconds.

> **Note:** Both `public/data.json` and `public/search_donors.json` are committed, so the full app works immediately after clone. You only need to run the script if the CSVs have been updated.

### 4. Install dependencies and run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Data Pipeline

`scripts/preprocess.py` does everything in pure Python stdlib:

```
contributions-pro-en.csv  ─┐
                            ├─► preprocess.py ─┬─► public/data.json
contributions-mun-en.csv  ─┘                   └─► public/search_donors.json
```

**What it computes:**

| Output key | Description |
| --- | --- |
| `summary` | Totals (amount, donations, donors, year range) |
| `mapPoints` | One entry per FSA with lat/lng, total, count, party breakdown |
| `yearParty` | Year × party donation totals (provincial, main 5 parties) |
| `parties` | Top 20 parties by total raised |
| `cities` | Top 15 cities by total raised |
| `multi` | Donors who gave to 3+ different parties |
| `donorDist` | Donation size buckets ($50–100, $101–200, etc.) |

**FSA coordinates** — ~383 Quebec postal code centroids are hardcoded in the script. Each maps a 3-character FSA (e.g. `H3Y`, `J6J`) to `[lat, lng]`. These were manually verified against known municipality locations; some rural FSAs use approximate centroids.

**Party normalisation** — full party names from the CSV are mapped to 8 short codes:

| Code | Party |
| --- | --- |
| PQ | Parti Québécois |
| CAQ | Coalition Avenir Québec |
| PLQ | Parti libéral du Québec |
| QS | Québec solidaire |
| PCQ | Parti conservateur du Québec |
| PM | Projet Montréal |
| EM | Ensemble Montréal |
| OTHER | All others |

---

## Map Implementation

The map uses **Apple MapKit JS** loaded via CDN. Circles are rendered as `mapkit.Annotation` with custom HTML `<div>` elements — **not** `mapkit.CircleOverlay` — so they stay a fixed pixel size regardless of zoom level.

```js
// Each dot is a custom annotation factory
const factory = () => {
    const div = document.createElement('div')
    Object.assign(div.style, {
        width: `${size}px`, height: `${size}px`,
        borderRadius: '50%',
        background: color,   // party colour
        // ...
    })
    return div
}
new mapkit.Annotation(coord, factory, { calloutEnabled: false })
```

**Sizing formula:** `size = Math.max(6, Math.sqrt(total / maxTotal) * 52)` pixels — square-root scale so large cities don't completely dominate.

### MapKit JS token

The JWT token embedded in `MapView.jsx` is scoped to `mapkit_js` and has an expiry date. If the map stops loading, generate a new token in [Apple Developer → Maps → Keys](https://developer.apple.com/account/resources/authkeys/list) and replace the `TOKEN` constant at the top of `src/components/MapView.jsx`.

---

## Building for Production

```bash
npm run build
```

Output goes to `dist/`. The site is fully static — deploy to any static host:

- **Vercel** — push to GitHub, import project, zero config needed
- **Netlify** — same, drag-and-drop `dist/` or connect repo
- **GitHub Pages** — set `base` in `vite.config.js` if serving from a subdirectory

> `public/search_donors.json` (7 MB) is committed alongside the code, so search works on any deployment without a build step.

---

## Data Notes

- All data is sourced from Élections Québec's **public donor registry** under the *Act respecting elections and referendums in municipalities* and the *Election Act*. All contributions are public record.
- The dataset covers **2019–2026** (the available download window at time of processing).
- Donations below $50 are not disclosed in the registry.
- The same donor name can appear multiple times across years and parties — the preprocessor aggregates by exact name string.
- Municipal and provincial donations are tracked separately by law; both are included here.

---

## License

Data is public record from Élections Québec (CC-BY).  
Code is MIT — do whatever you want with it.

---

*Built with React + Vite. Map powered by Apple MapKit JS. Data from Élections Québec.*
