export function fmt(n) {
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000)    return '$' + (n / 1000).toFixed(0) + 'k'
  return '$' + Math.round(n).toLocaleString()
}
