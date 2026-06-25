export const PARTY_COLORS = {
  PQ:    '#1a3a6b',
  CAQ:   '#c0392b',
  PLQ:   '#8B0000',
  QS:    '#c96a00',
  PCQ:   '#555555',
  PM:    '#1d6b3b',
  EM:    '#1a3a6b',
  OTHER: '#888888',
}

export function getPartyColor(name) {
  const n = name.toLowerCase()
  if (n.includes('québécois') && !n.includes('projet')) return '#1a3a6b'
  if (n.includes('coalition avenir'))                    return '#c0392b'
  if (n.includes('libéral') || n.includes('liberal'))   return '#8B0000'
  if (n.includes('solidaire'))                          return '#c96a00'
  if (n.includes('conservateur'))                       return '#555555'
  if (n.includes('projet mont'))                        return '#1d6b3b'
  if (n.includes('ensemble mont'))                      return '#1a3a6b'
  return '#888888'
}

export function shortParty(p) {
  return p
    .replace('/Quebec Liberal Party', '')
    .replace(' - Équipe Soraya', '')
    .replace(' - Équipe Luc Rabouin', '')
    .replace(' - Équipe Valérie Plante', '')
    .replace('Parti québécois', 'PQ')
    .replace('Coalition avenir Québec', 'CAQ')
    .replace('Parti libéral du Québec', 'PLQ')
    .replace('Québec solidaire', 'QS')
    .replace('Parti conservateur du Québec', 'PCQ')
    .trim()
}
