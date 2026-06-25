#!/usr/bin/env python3
"""
Preprocess Quebec political donation CSVs → public/data.json + public/search_donors.json
Run from project root: python scripts/preprocess.py
"""
import csv
import json
import os
from collections import defaultdict

FSA_COORDS = {
    # Montreal core
    "H3Y": [45.4727, -73.5943], "H2V": [45.5228, -73.6089], "H2J": [45.5241, -73.5819],
    "H2L": [45.5189, -73.5698], "H1Y": [45.5681, -73.5589], "H3E": [45.4526, -73.5392],
    "H3R": [45.4944, -73.6528], "H2K": [45.5289, -73.5548], "H3Z": [45.4743, -73.5881],
    "H3G": [45.4975, -73.5798], "H2X": [45.5105, -73.5681], "H2H": [45.5344, -73.5611],
    "H2T": [45.5244, -73.5939], "H4C": [45.4713, -73.5811], "H3K": [45.4807, -73.5674],
    "H3S": [45.4944, -73.6211], "H4W": [45.4594, -73.6389], "H4B": [45.4614, -73.6156],
    "H3A": [45.5046, -73.5772], "H3T": [45.4978, -73.6278], "H3B": [45.5, -73.5667],
    "H3C": [45.4917, -73.5583], "H3H": [45.5, -73.5917], "H3J": [45.4833, -73.5667],
    "H3L": [45.5, -73.6],     "H3M": [45.5167, -73.6333], "H3N": [45.5167, -73.5667],
    "H3P": [45.5, -73.6167],  "H3V": [45.5, -73.6333],   "H3W": [45.4833, -73.6167],
    "H3X": [45.4833, -73.6333],
    # Montreal H2
    "H2A": [45.5583, -73.5833], "H2B": [45.5583, -73.6], "H2C": [45.5583, -73.6167],
    "H2E": [45.5417, -73.6],   "H2G": [45.5417, -73.6167], "H2M": [45.5333, -73.6167],
    "H2N": [45.5333, -73.6],   "H2P": [45.5167, -73.6167], "H2R": [45.5167, -73.6],
    "H2S": [45.5333, -73.6333], "H2W": [45.5167, -73.5833], "H2Y": [45.5, -73.5667],
    "H2Z": [45.5, -73.5833],
    # Montreal H1
    "H1A": [45.55, -73.5167],  "H1B": [45.5667, -73.5167], "H1C": [45.5833, -73.5167],
    "H1E": [45.5833, -73.5667], "H1G": [45.5833, -73.5833], "H1H": [45.5667, -73.5833],
    "H1J": [45.5667, -73.5667], "H1K": [45.5667, -73.5333], "H1L": [45.55, -73.5333],
    "H1M": [45.55, -73.5667],  "H1N": [45.5333, -73.5333], "H1P": [45.5833, -73.5333],
    "H1R": [45.5667, -73.6],   "H1S": [45.5333, -73.5667], "H1T": [45.5333, -73.5833],
    "H1V": [45.5167, -73.5667], "H1W": [45.5167, -73.5833], "H1X": [45.5167, -73.5333],
    "H1Z": [45.5667, -73.6167],
    # Montreal H4
    "H4A": [45.4667, -73.6167], "H4E": [45.4667, -73.5833], "H4G": [45.4667, -73.6],
    "H4H": [45.4667, -73.5667], "H4J": [45.5, -73.6667],   "H4K": [45.5167, -73.6667],
    "H4L": [45.5, -73.65],     "H4M": [45.5167, -73.6333], "H4N": [45.5333, -73.6667],
    "H4P": [45.4833, -73.6],   "H4R": [45.5, -73.6833],   "H4S": [45.5, -73.7],
    "H4T": [45.4833, -73.65],  "H4V": [45.4667, -73.6],   "H4X": [45.4667, -73.5833],
    "H4Y": [45.45, -73.75],    "H4Z": [45.5, -73.5667],
    # Laval H7
    "H7A": [45.5333, -73.7667], "H7B": [45.55, -73.7833],  "H7C": [45.5667, -73.7667],
    "H7E": [45.55, -73.7667],  "H7G": [45.6167, -73.7333], "H7H": [45.5667, -73.8167],
    "H7J": [45.5333, -73.7833], "H7K": [45.5667, -73.8],   "H7L": [45.5833, -73.7667],
    "H7M": [45.5833, -73.7333], "H7N": [45.5833, -73.7833], "H7P": [45.5833, -73.75],
    "H7R": [45.5667, -73.7167], "H7S": [45.55, -73.75],    "H7T": [45.5833, -73.8],
    "H7V": [45.5667, -73.7833], "H7W": [45.5667, -73.7333], "H7X": [45.5333, -73.8167],
    "H7Y": [45.55, -73.8167],
    # West Island H8/H9
    "H8N": [45.4667, -73.7167], "H8P": [45.4833, -73.7],   "H8R": [45.4667, -73.7333],
    "H8S": [45.4667, -73.75],  "H8T": [45.45, -73.7167],  "H8Y": [45.45, -73.7],
    "H8Z": [45.4333, -73.8167], "H9A": [45.45, -73.8],     "H9B": [45.45, -73.8333],
    "H9C": [45.4333, -73.8],   "H9E": [45.4333, -73.8333], "H9G": [45.4167, -73.8],
    "H9H": [45.4167, -73.8333], "H9J": [45.4167, -73.7667], "H9K": [45.4, -73.8],
    "H9P": [45.4333, -73.7667], "H9R": [45.4667, -73.8],   "H9S": [45.4667, -73.7833],
    "H9W": [45.4, -73.8333],   "H9X": [45.3833, -73.8667],
    # Quebec City G1
    "G1S": [46.7994, -71.2844], "G1R": [46.8139, -71.2167], "G1W": [46.7886, -71.3011],
    "G1K": [46.8028, -71.2239], "G1V": [46.7797, -71.2822], "G1T": [46.8194, -71.2556],
    "G1P": [46.7569, -71.3567], "G1A": [46.8, -71.2],       "G1B": [46.85, -71.15],
    "G1C": [46.83, -71.17],    "G1E": [46.85, -71.13],     "G1G": [46.8333, -71.25],
    "G1H": [46.83, -71.28],    "G1J": [46.82, -71.25],     "G1L": [46.8139, -71.2],
    "G1M": [46.8, -71.28],     "G1N": [46.79, -71.28],     "G1X": [46.77, -71.3],
    "G1Y": [46.78, -71.28],
    # Quebec City G2
    "G2K": [46.8878, -71.2428], "G2B": [46.8839, -71.2822], "G2J": [46.8667, -71.25],
    "G2A": [46.9, -71.25],     "G2C": [46.9167, -71.2833], "G2E": [46.8667, -71.4167],
    "G2G": [46.8667, -71.4],   "G2L": [46.9, -71.3],       "G2M": [46.8833, -71.3833],
    "G2N": [46.8667, -71.3333],
    # Quebec City G3
    "G3A": [46.95, -71.5],     "G3B": [46.95, -71.45],    "G3C": [46.95, -71.4],
    "G3E": [46.9167, -71.4833], "G3G": [46.9, -71.5],      "G3H": [46.85, -71.5],
    "G3J": [46.9333, -71.4833], "G3L": [47.0, -71.45],     "G3M": [46.9167, -71.55],
    "G3N": [47.05, -71.7],     "G3Z": [47.0, -71.5],
    # Chaudière-Appalaches G6
    "G6J": [46.8, -71.1667],   "G6K": [46.7667, -71.1667], "G6L": [46.7833, -71.2],
    "G6P": [46.7667, -71.2333], "G6R": [46.75, -71.0833],  "G6S": [46.75, -71.1667],
    "G6T": [46.7167, -71.2167], "G6V": [46.7667, -71.15],  "G6W": [46.7167, -71.1667],
    "G6X": [46.75, -71.1333],  "G6Y": [46.7167, -71.3],   "G6Z": [46.7167, -71.25],
    # Saguenay G7
    "G7H": [48.4, -71.0333],   "G7J": [48.4333, -71.05],  "G7N": [48.4167, -71.0667],
    "G7A": [48.5167, -71.6333], "G7B": [48.5, -71.65],     "G7G": [48.4333, -71.1],
    "G7K": [48.5, -71.6],      "G7P": [48.4167, -71.2],   "G7S": [48.4167, -71.1667],
    "G7X": [48.5, -71.7167],   "G7Z": [48.5167, -71.6667],
    # Trois-Rivières G8/G9
    "G8A": [46.3, -72.5167],   "G8B": [46.3167, -72.5],   "G8C": [46.3, -72.5333],
    "G8E": [46.3333, -72.4667], "G8G": [46.3167, -72.5167], "G8H": [46.3333, -72.4833],
    "G8J": [46.3, -72.55],     "G8K": [46.3333, -72.5167], "G8L": [46.3, -72.5833],
    "G8M": [46.2833, -72.5333], "G8N": [46.3167, -72.5333], "G8P": [46.3, -72.5667],
    "G8T": [46.3167, -72.5667], "G8V": [46.3167, -72.55],  "G8W": [46.3333, -72.5333],
    "G8Y": [46.3333, -72.5667], "G8Z": [46.3167, -72.6],
    "G9A": [46.35, -72.5333],  "G9B": [46.35, -72.5167],  "G9H": [46.3667, -72.6],
    "G9N": [46.4, -72.5667],   "G9T": [46.3833, -72.5167],
    # Regional G0
    "G0A": [47.05, -70.88],     "G0R": [46.8333, -70.5],   "G0X": [47.3333, -72.5],
    "G0S": [46.5, -71.3333],   "G0B": [47.44, -70.49],    "G0E": [46.98, -70.55],
    "G0G": [48.5, -68.5],      "G0H": [47.8, -70.7],      "G0J": [48.3, -67.8],
    "G0K": [47.5667, -70.0],   "G0L": [47.8667, -69.5],   "G0M": [46.0833, -71.5],
    "G0N": [46.3, -71.2],      "G0P": [46.5, -70.5],      "G0Q": [46.6, -72.5],
    "G0T": [47.7, -70.3],      "G0U": [46.5, -72.0],      "G0V": [47.1667, -71.5],
    "G0W": [47.5, -72.0],      "G0Y": [45.5, -71.0],      "G0Z": [45.75, -71.5],
    "G0C": [48.2333, -65.7333],
    # Bas-Saint-Laurent G5
    "G5A": [47.8333, -69.5333], "G5B": [47.8, -69.5],      "G5C": [47.75, -69.55],
    "G5J": [47.7167, -69.6],   "G5L": [48.0667, -69.7167], "G5M": [48.0667, -69.7],
    "G5N": [48.1167, -69.8],   "G5R": [47.85, -69.55],    "G5T": [47.9333, -69.65],
    # Outaouais J8/J9
    "J9A": [45.45, -75.7833],  "J8T": [45.4667, -75.7333], "J8Y": [45.4333, -75.7167],
    "J8V": [45.45, -75.7167],  "J8Z": [45.4167, -75.75],  "J8X": [45.4333, -75.7667],
    "J8A": [45.4667, -75.75],  "J8B": [45.4167, -76.0],   "J8C": [45.5, -76.0],
    "J8E": [45.5667, -75.5833], "J8G": [45.5833, -75.6333], "J8H": [45.45, -75.9167],
    "J8L": [45.5167, -75.8833], "J8M": [45.5333, -75.8833], "J8N": [45.5667, -75.85],
    "J8P": [45.4, -75.6833],   "J8R": [45.5167, -75.7],   "J9B": [45.45, -75.8167],
    "J9E": [45.4167, -75.8333], "J9H": [45.3667, -75.8333], "J9J": [45.3833, -75.8167],
    "J9L": [45.7667, -74.6167], "J9P": [48.3167, -77.7833], "J9T": [48.0667, -77.7833],
    "J9V": [47.75, -78.1333],  "J9X": [48.7667, -79.5],   "J9Y": [46.7833, -79.0833],
    "J9Z": [46.0833, -77.3333],
    # Laurentides J7
    "J7A": [45.5667, -73.8667], "J7B": [45.5833, -73.8333], "J7C": [45.5, -73.8833],
    "J7E": [45.5167, -73.85],  "J7G": [45.5667, -73.9],   "J7H": [45.5333, -73.9167],
    "J7J": [45.5667, -73.8],   "J7K": [45.5167, -73.9],   "J7L": [45.5667, -73.85],
    "J7M": [45.5333, -73.8833], "J7N": [45.5, -73.9],      "J7P": [45.5667, -73.9167],
    "J7R": [45.5333, -73.8333], "J7T": [45.5167, -73.8333],
    "J7V": [45.45, -74.1167],  "J7X": [45.5, -74.1],      "J7Y": [45.5167, -74.05],
    "J7Z": [45.5333, -74.0333],
    # Montérégie J4 — Longueuil / Boucherville / South Shore
    # J4B/G/H were placed near Sainte-Julie (too far east), corrected:
    "J4B": [45.596, -73.431],  "J4H": [45.469, -73.469],  "J4G": [45.481, -73.454],
    "J4N": [45.55, -73.4667],  "J4J": [45.5167, -73.5167], "J4K": [45.5167, -73.4833],
    "J4R": [45.4167, -73.497], "J4A": [45.55, -73.45],    "J4C": [45.5167, -73.4333],
    "J4E": [45.55, -73.4],     "J4L": [45.5333, -73.4667], "J4M": [45.55, -73.4167],
    "J4P": [45.5167, -73.5],   "J4S": [45.5, -73.5167],   "J4T": [45.5333, -73.5],
    "J4V": [45.5, -73.5667],   "J4W": [45.4667, -73.5],   "J4X": [45.5167, -73.4833],
    "J4Y": [45.5333, -73.4667], "J4Z": [45.5, -73.4833],
    # J6 — North shore Laurentides
    "J6A": [45.566, -73.900],  # Saint-Eustache (was 18 km too far east)
    "J6E": [45.778, -74.003],  # Saint-Jérôme
    # J6J–J6W were ALL placed in DDO/West Island — they belong in the Châteauguay Valley south of Montreal:
    "J6J": [45.322, -73.745],  # Châteauguay (core)
    "J6K": [45.356, -73.801],  # Léry
    "J6N": [45.287, -73.878],  # Beauharnois
    "J6R": [45.373, -73.575],  # Saint-Constant
    "J6S": [45.368, -73.541],  # Delson
    "J6T": [45.383, -73.520],  # Candiac
    "J6V": [45.297, -73.695],  # Saint-Isidore
    "J6W": [45.264, -73.611],  # Saint-Rémi
    # J6X–J6Z Terrebonne / Mascouche area (north shore)
    "J6X": [45.704, -73.637],  # Terrebonne (ville)
    "J6Y": [45.693, -73.617],  # Lachenaie
    "J6Z": [45.750, -73.598],  # Mascouche
    # Rive-Sud J3/J5
    "J3Y": [45.3667, -73.4333], "J3A": [45.3, -72.95],     "J3B": [45.2833, -72.9833],
    "J3E": [45.35, -73.2333],  "J3G": [45.3333, -73.2],   "J3H": [45.3167, -73.2333],
    "J3L": [45.3167, -73.05],  "J3M": [45.3333, -73.3],   "J3N": [45.3333, -73.3333],
    "J3P": [45.3667, -72.9833], "J3R": [45.3833, -73.0667], "J3T": [45.3167, -73.3167],
    "J3V": [45.3833, -73.1],   "J3X": [45.3667, -73.1667], "J3Z": [45.35, -73.1833],
    "J5A": [45.6, -73.4333],   "J5B": [45.6333, -73.4667], "J5C": [45.5833, -73.45],
    "J5J": [45.6167, -73.5167], "J5K": [45.5833, -73.5333], "J5L": [45.6, -73.5667],
    "J5M": [45.5833, -73.5667], "J5R": [45.5667, -73.5333], "J5T": [45.5667, -73.5667],
    "J5V": [45.55, -73.55],    "J5W": [45.6167, -73.5667], "J5X": [45.5667, -73.4833],
    "J5Y": [45.5667, -73.5833], "J5Z": [45.5667, -73.6167],
    # Eastern Townships J0/J1/J2
    "J0B": [45.2167, -72.3333], "J0E": [45.25, -72.75],    "J0L": [45.3333, -73.6667],
    "J0R": [45.6667, -74.3333], "J0T": [46.0, -74.5],      "J0K": [46.3333, -73.5],
    "J0A": [45.3333, -72.6667], "J0C": [45.6667, -72.0],   "J0G": [45.7833, -72.8667],
    "J0H": [45.1667, -72.8667], "J0J": [45.0667, -73.1],   "J0N": [45.5333, -73.8167],
    "J0P": [45.4333, -73.7167], "J0Q": [46.1, -74.8],      "J0S": [45.25, -73.3333],
    "J0V": [46.0, -74.6667],   "J0W": [46.2, -75.5],      "J0X": [45.5833, -75.5667],
    "J0Y": [48.9, -79.1167],   "J0Z": [46.8333, -79.0833],
    "J1A": [45.134, -71.802],   "J1E": [45.4, -71.8833],   "J1G": [45.4, -71.9],
    "J1H": [45.4, -71.8833],   "J1J": [45.3833, -71.9333], "J1K": [45.3833, -71.9667],
    "J1L": [45.4167, -71.9333], "J1M": [45.3667, -72.0167], "J1N": [45.3833, -71.9833],
    "J1R": [45.3667, -72.0667], "J1S": [45.2667, -72.1167], "J1T": [45.25, -72.0833],
    "J1X": [45.3833, -72.15],  "J1Z": [45.4, -72.0333],
    "J2A": [45.8833, -72.5167], "J2B": [45.9, -72.5167],   "J2C": [45.9167, -72.5333],
    "J2E": [45.9333, -72.5333], "J2G": [45.403, -72.733],  "J2H": [45.420, -72.741],
    "J2J": [45.650, -72.568],  "J2K": [45.427, -72.694],  "J2L": [45.398, -72.755],
    "J2N": [45.9333, -72.5],   "J2R": [45.9167, -72.5],   "J2S": [45.352, -72.517],
    "J2T": [45.347, -72.523],  "J2W": [45.9, -72.5333],   "J2X": [45.627, -72.952],
    "J2Y": [45.9167, -72.4833],
}

PARTY_SHORT = {
    'parti québécois': 'PQ',
    'coalition avenir québec': 'CAQ',
    'parti libéral du québec': 'PLQ',
    'quebec liberal party': 'PLQ',
    'québec solidaire': 'QS',
    'parti conservateur du québec': 'PCQ',
    'projet montréal': 'PM',
    'ensemble montréal': 'EM',
}

def get_short(party):
    p = party.lower()
    for k, v in PARTY_SHORT.items():
        if k in p:
            return v
    return 'OTHER'

def parse_amount(s):
    try:
        cleaned = s.replace('\xa0', '').replace(' ', '').replace(' ', '').replace(',', '.')
        return float(cleaned)
    except Exception:
        return 0.0

def load_csv(path, level):
    rows = []
    with open(path, encoding='latin-1') as f:
        next(f)  # skip production date line
        next(f)  # skip blank line
        reader = csv.reader(f, delimiter=';', quotechar='"')
        headers = [h.strip() for h in next(reader)]
        for row in reader:
            if not row or len(row) < 3:
                continue
            r = {headers[i]: row[i].strip() for i in range(min(len(headers), len(row)))}
            party = r.get('Political entity', '').strip()
            if not party:
                continue
            postal = r.get('Postal code', '').strip()
            fsa = postal[:3].upper() if len(postal) >= 3 else ''
            fy = r.get('Fiscal year', '').strip()
            rows.append({
                'name': r.get('Surname, Given name', '').strip(),
                'amount': parse_amount(r.get('Total amount', '0')),
                'city': r.get('Municipality', '').strip(),
                'fsa': fsa,
                'party': party,
                'short': get_short(party),
                'year': int(fy) if fy.isdigit() else None,
                'level': level,
            })
    return rows

def main():
    os.makedirs('public', exist_ok=True)

    print('Loading CSVs...')
    pro = load_csv('contributions-pro-en.csv', 'provincial')
    mun = load_csv('contributions-mun-en.csv', 'municipal')
    all_rows = pro + mun
    print(f'  Loaded {len(all_rows):,} rows total ({len(pro):,} provincial, {len(mun):,} municipal)')

    # ── Summary ──
    total_amount = sum(r['amount'] for r in all_rows)
    unique_donors = len(set(r['name'] for r in all_rows if r['name']))
    years = sorted(set(r['year'] for r in all_rows if r['year']))
    summary = {
        'total_donations': len(all_rows),
        'total_amount': round(total_amount, 2),
        'unique_donors': unique_donors,
        'year_min': min(years) if years else 2019,
        'year_max': max(years) if years else 2026,
    }
    print(f"  ${total_amount:,.0f} total | {unique_donors:,} unique donors")

    # ── Map Points (by FSA, only known coordinates) ──
    fsa_data = defaultdict(lambda: {'total': 0.0, 'count': 0, 'parties': defaultdict(float)})
    for r in all_rows:
        if r['fsa'] and r['fsa'] in FSA_COORDS:
            fsa_data[r['fsa']]['total'] += r['amount']
            fsa_data[r['fsa']]['count'] += 1
            fsa_data[r['fsa']]['parties'][r['short']] += r['amount']

    map_points = []
    for fsa, d in sorted(fsa_data.items(), key=lambda x: -x[1]['total']):
        coords = FSA_COORDS[fsa]
        parties = dict(d['parties'])
        top_party = max(parties, key=parties.get) if parties else 'OTHER'
        map_points.append({
            'fsa': fsa,
            'lat': coords[0],
            'lng': coords[1],
            'total': round(d['total'], 2),
            'count': d['count'],
            'top_party': top_party,
            'parties': {k: round(v, 2) for k, v in sorted(parties.items(), key=lambda x: -x[1])},
        })
    print(f'  Map points: {len(map_points)} FSAs')

    # ── Year × Party (provincial only, main 5 parties) ──
    year_party = defaultdict(lambda: defaultdict(float))
    for r in pro:
        if r['year'] and r['short'] in ('PQ', 'CAQ', 'PLQ', 'QS', 'PCQ'):
            year_party[str(r['year'])][r['short']] += r['amount']
    year_party_out = {
        y: {p: round(v, 2) for p, v in ps.items()}
        for y, ps in sorted(year_party.items())
    }

    # ── Parties ──
    party_agg = defaultdict(lambda: {'total': 0.0, 'donors': set(), 'level': 'provincial'})
    for r in all_rows:
        if r['party'] and r['name']:
            party_agg[r['party']]['total'] += r['amount']
            party_agg[r['party']]['donors'].add(r['name'])
            party_agg[r['party']]['level'] = r['level']
    parties_out = sorted(
        [[name, round(d['total'], 2), len(d['donors']), d['level']]
         for name, d in party_agg.items() if d['total'] > 5000],
        key=lambda x: -x[1]
    )[:20]

    # ── Donor aggregation ──
    donor_agg = defaultdict(lambda: {'total': 0.0, 'parties': set(), 'city': '', 'years': set()})
    for r in all_rows:
        if not r['name']:
            continue
        donor_agg[r['name']]['total'] += r['amount']
        donor_agg[r['name']]['parties'].add(r['party'])
        if r['city']:
            donor_agg[r['name']]['city'] = r['city']
        if r['year']:
            donor_agg[r['name']]['years'].add(r['year'])

    # Top 20 donors (all-time)
    top_donors = sorted(
        [[name, round(d['total'], 2), list(d['parties'])]
         for name, d in donor_agg.items()],
        key=lambda x: -x[1]
    )[:20]

    # ── Cities ──
    city_agg = defaultdict(lambda: {'total': 0.0, 'count': 0})
    for r in all_rows:
        if r['city']:
            city_agg[r['city']]['total'] += r['amount']
            city_agg[r['city']]['count'] += 1
    cities_out = sorted(
        [[city, round(d['total'], 2), d['count']]
         for city, d in city_agg.items()],
        key=lambda x: -x[1]
    )[:15]

    # ── Multi-party donors (3+ parties) ──
    multi_out = sorted(
        [[name, round(d['total'], 2), list(d['parties'])]
         for name, d in donor_agg.items()
         if len(d['parties']) >= 3],
        key=lambda x: -x[1]
    )[:15]

    # ── Donation size distribution ──
    buckets = [0, 0, 0, 0, 0]  # $50-100, $101-200, $201-300, $301-500, $501+
    for r in all_rows:
        a = r['amount']
        if 50 <= a <= 100:
            buckets[0] += 1
        elif 100 < a <= 200:
            buckets[1] += 1
        elif 200 < a <= 300:
            buckets[2] += 1
        elif 300 < a <= 500:
            buckets[3] += 1
        elif a > 500:
            buckets[4] += 1

    # ── Write public/data.json ──
    data = {
        'summary': summary,
        'mapPoints': map_points,
        'yearParty': year_party_out,
        'parties': parties_out,
        'donors': top_donors,
        'cities': cities_out,
        'multi': multi_out,
        'donorDist': buckets,
    }
    with open('public/data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, separators=(',', ':'))
    size_kb = os.path.getsize('public/data.json') / 1024
    print(f'  Wrote public/data.json ({size_kb:.0f} KB)')

    # ── Write public/search_donors.json (all unique donors for search) ──
    search_donors = []
    for name, d in donor_agg.items():
        if not name:
            continue
        shorts = list(dict.fromkeys(get_short(p) for p in d['parties']))
        search_donors.append({
            'n': name,
            'c': d['city'],
            't': round(d['total'], 2),
            'p': shorts,
        })
    search_donors.sort(key=lambda x: -x['t'])

    with open('public/search_donors.json', 'w', encoding='utf-8') as f:
        json.dump(search_donors, f, ensure_ascii=False, separators=(',', ':'))
    size_kb = os.path.getsize('public/search_donors.json') / 1024
    print(f'  Wrote public/search_donors.json ({len(search_donors):,} donors, {size_kb:.0f} KB)')
    print('Done!')

if __name__ == '__main__':
    main()
