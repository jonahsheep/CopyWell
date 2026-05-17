function isCodeBlock(text) {
  const codeKeywords = /\b(function|const|let|var|class|import|export|def|if|else|for|while|return|import|from|require|module|console|log|print)\b/i
  const hasBraces = /[{}]/
  const hasSemicolons = /;/
  const hasIndents = /^(?: {4,}|\t+)/m
  return (codeKeywords.test(text) && hasBraces.test(text) && hasSemicolons.test(text)) || hasIndents.test(text)
}

function isBulletList(text) {
  return /^(?:[-*+]\s|\d+[.)]\s)/m.test(text)
}

function isPoetry(text) {
  const lines = text.split('\n').filter(l => l.trim())
  if (lines.length < 4) return false
  const avgLineLen = lines.reduce((sum, l) => sum + l.trim().length, 0) / lines.length
  if (avgLineLen >= 30) return false
  const allCapitalized = lines.every(l => /^[A-Z]/.test(l.trim()))
  const noPunctuationEnd = lines.slice(0, -1).every(l => !/[.?!:]$/.test(l.trim()))
  return allCapitalized && noPunctuationEnd
}

function hasCitationMarker(text) {
  return /\[\d+(?:[,\s-]+\d+)*\]|\(\d{4}\)|\[\d{4}\]/.test(text)
}

function detectStructure(text) {
  return {
    isCode: isCodeBlock(text),
    isBulletList: isBulletList(text),
    isPoetry: isPoetry(text),
    hasCitations: hasCitationMarker(text)
  }
}
