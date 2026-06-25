import { useLang } from '../context/LanguageContext'

const CONTENT = {
  en: {
    kicker: 'About this project',
    headline: <>Money is the oxygen of politics.<br /><em>We mapped where it comes from.</em></>,
    sections: [
      {
        title: 'The data',
        body: (
          <>
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
          </>
        ),
      },
      {
        title: 'How it works',
        body: (
          <>
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
          </>
        ),
      },
      {
        title: 'The map',
        body: (
          <>
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
          </>
        ),
      },
      {
        title: 'Why we built this',
        body: (
          <>
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
          </>
        ),
      },
    ],
    meta: [
      { label: 'Data source',       value: 'Élections Québec — Public Donor Registry' },
      { label: 'Coverage',          value: '2019 – 2026 · Provincial & Municipal' },
      { label: 'Minimum donation',  value: '$50 (below this threshold, donations are not disclosed)' },
      { label: 'Tech stack',        value: 'React · Vite · Apple MapKit JS · Chart.js · Fuse.js · Python' },
      { label: 'License',           value: 'Code: MIT · Data: public record (CC-BY, Élections Québec)' },
    ],
  },

  fr: {
    kicker: 'À propos de ce projet',
    headline: <>L&rsquo;argent est l&rsquo;oxygène de la politique.<br /><em>Nous avons cartographié sa provenance.</em></>,
    sections: [
      {
        title: 'Les données',
        body: (
          <>
            <p>
              Tout don de 50 $ ou plus versé à un parti politique québécois doit être divulgué
              publiquement par la loi — au niveau provincial en vertu de la <em>Loi électorale</em>{' '}
              et au niveau municipal en vertu de la <em>Loi sur les élections et les référendums
              dans les municipalités</em>. Élections Québec publie ce registre sous forme de
              fichiers CSV téléchargeables, mis à jour régulièrement.
            </p>
            <p>
              Nous avons téléchargé les deux fichiers directement depuis le registre officiel —
              sans extraction automatisée, sans intermédiaires. Les données brutes couvrent{' '}
              <strong>289 374 transactions individuelles</strong> totalisant{' '}
              <strong>30,4 M$</strong> versés entre 2019 et 2026, provenant de{' '}
              <strong>108 216 donateurs uniques</strong> à travers le Québec.
            </p>
          </>
        ),
      },
      {
        title: 'Comment ça fonctionne',
        body: (
          <>
            <p>
              Un script Python lit les deux fichiers CSV (encodés en Latin-1, délimités par des
              points-virgules — exactement comme Élections Québec les exporte), normalise les noms
              des partis, regroupe les dons par code postal et par année, et génère deux fichiers
              JSON compacts. L&rsquo;ensemble du traitement s&rsquo;effectue en moins de 10 secondes
              et ne nécessite aucune bibliothèque externe.
            </p>
            <p>
              L&rsquo;application elle-même est un site React statique. Pas de serveur. Pas de base
              de données. Aucun appel API après le chargement de la page. Le fichier de synthèse
              de 80 Ko alimente la carte et les graphiques ; un index de donateurs de 7 Mo alimente
              la recherche. Tout s&rsquo;exécute dans votre navigateur.
            </p>
          </>
        ),
      },
      {
        title: 'La carte',
        body: (
          <>
            <p>
              Le Québec est divisé en 383 secteurs de tri d&rsquo;acheminement (STA) — les trois
              premiers caractères d&rsquo;un code postal canadien (p. ex. <strong>H3Y</strong> pour
              Westmount, <strong>G1R</strong> pour le Vieux-Québec). Nous utilisons ces unités
              géographiques car elles offrent le bon équilibre : assez précises pour révéler des
              tendances à l&rsquo;échelle du quartier, assez larges pour que chaque zone dispose
              de données significatives.
            </p>
            <p>
              La taille de chaque point est proportionnelle à la racine carrée du total des dons
              provenant de cette zone — afin que Montréal n&rsquo;écrase pas complètement le reste
              de la province. La couleur reflète le parti ayant reçu le plus d&rsquo;argent de ce STA.
            </p>
          </>
        ),
      },
      {
        title: 'Pourquoi ce projet',
        body: (
          <>
            <p>
              Les dons politiques sont publics pour une raison. Ils révèlent les relations
              financières entre les citoyens et les partis qui les gouvernent — qui finance qui,
              quels quartiers penchent fortement vers un parti, et quels donateurs distribuent
              leur argent entre plusieurs partis à la fois.
            </p>
            <p>
              Ces données ont toujours été techniquement accessibles. Mais des fichiers CSV de
              289 000 lignes ne sont pas accessibles à la plupart des gens. Ce projet existe
              pour changer cela.
            </p>
          </>
        ),
      },
    ],
    meta: [
      { label: 'Source des données', value: 'Élections Québec — Registre des donateurs' },
      { label: 'Couverture',         value: '2019 – 2026 · Provincial et municipal' },
      { label: 'Don minimum',        value: '50 $ (en dessous de ce seuil, les dons ne sont pas divulgués)' },
      { label: 'Technologies',       value: 'React · Vite · Apple MapKit JS · Chart.js · Fuse.js · Python' },
      { label: 'Licence',            value: 'Code : MIT · Données : domaine public (CC-BY, Élections Québec)' },
    ],
  },
}

export default function AboutView() {
  const { lang } = useLang()
  const c = CONTENT[lang]

  return (
    <div className="about-wrap">
      <div className="about-hero">
        <div className="about-kicker">{c.kicker}</div>
        <h2 className="about-headline">{c.headline}</h2>
      </div>

      <div className="about-body">
        {c.sections.map(s => (
          <div key={s.title} className="about-section">
            <h3>{s.title}</h3>
            {s.body}
          </div>
        ))}

        <div className="about-meta">
          {c.meta.map(row => (
            <div key={row.label} className="about-meta-row">
              <span className="about-meta-label">{row.label}</span>
              <span>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
