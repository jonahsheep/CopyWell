let lastClipboard = ''
let isProcessing = false

function normalizeQuotes(text) {
  return text.replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"').replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'")
}

function normalizeDashes(text) {
  return text.replace(/\u2013|\u2014/g, '-').replace(/\u2015/g, '--')
}

function removeInvisibleChars(text) {
  return text.replace(/[\u200B-\u200D\uFEFF\u00AD\u2060\u2061\u2062\u2063\u2064]/g, '')
}

function normalizeUnicode(text) {
  text = normalizeQuotes(text)
  text = normalizeDashes(text)
  text = removeInvisibleChars(text)
  return text.normalize('NFC')
}

function isCodeBlock(text) {
  const codeKeywords = /\b(function|const|let|var|class|import|export|def|if|else|for|while|return|import|from|require|module|console|log|print|async|await|try|catch|switch|case|throw|new|this|super|extends|implements|interface|type|enum|namespace|using|public|private|protected|static|readonly|void|null|undefined|true|false)\b/i
  const hasBraces = /[{}]/
  const hasSemicolons = /;/
  const hasIndents = /^(?: {4,}|\t+)/m
  const hasArrowFunc = /=>/;
  const hasComments = /\/\/|\/\*|\*\/|#/
  return (codeKeywords.test(text) && hasBraces.test(text) && hasSemicolons.test(text)) || hasIndents.test(text) || (hasArrowFunc.test(text) && hasBraces.test(text)) || (hasComments.test(text) && hasIndents.test(text))
}

function isBulletList(text) {
  return /^(?:[-*+•◦▸▹]\s|\d+[.)]\s|[a-zA-Z][.)]\s)/m.test(text)
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

function looksLikeCodeStart(line, nextLine) {
  if (isCodeBlock(line)) return true
  if (/^\s{4,}/.test(line)) return true
  if (/^\s*\{/.test(line)) return true

  const isFunctionDecl = /^\s*(function|class|const|let|var|async|import|export)\s+\w+/.test(line)
  const hasOpenBrace = /\{/.test(line)
  const nextLineIndented = nextLine && /^\s{4,}/.test(nextLine)

  return isFunctionDecl && (hasOpenBrace || nextLineIndented)
}

function cleanText(text) {
  if (!text) return text

  let result = normalizeUnicode(text)
  result = result.replace(/\r\n/g, '\n')

  const lines = result.split('\n')
  const processed = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const nextLine = lines[i + 1] || ''

    if (!line.trim()) {
      processed.push(line)
      i++
      continue
    }

    if (looksLikeCodeStart(line, nextLine)) {
      const codeLines = []
      while (i < lines.length && lines[i].trim()) {
        codeLines.push(lines[i])
        i++
      }
      processed.push(codeLines.join('\n'))
      continue
    }

    if (isBulletList(line)) {
      processed.push(line)
      i++
      while (i < lines.length && isBulletList(lines[i])) {
        processed.push(lines[i])
        i++
      }
      continue
    }

    if (isPoetry(line)) {
      const poetryLines = []
      while (i < lines.length && lines[i].trim()) {
        poetryLines.push(lines[i])
        i++
      }
      processed.push(poetryLines.join('\n'))
      continue
    }

    let buffer = line

    while (i + 1 < lines.length) {
      const nl = lines[i + 1]
      if (!nl.trim()) break

      if (looksLikeCodeStart(nl, lines[i + 2] || '')) break
      if (isBulletList(nl)) break
      if (isPoetry(nl)) break

      const curEnd = /[.!?:]$/.test(buffer.trim())
      const nextStart = /^[A-Z]/.test(nl.trimStart())
      const nextEnd = /[.!?:]$/.test(nl.trim())

      if (curEnd || nextStart || nextEnd) break

      buffer += ' ' + nl.trimStart()
      i++
    }

    processed.push(buffer)
    i++
  }

  result = processed.join('\n')

  if (hasCitationMarker(text)) {
    result = result.replace(/\[\d+(?:[,\s-]+\d+)*\]/g, ' ')
    result = result.replace(/\(\d{4}\)/g, ' ')
    result = result.replace(/\[\d{4}\]/g, ' ')
  }

  result = result.replace(/(?<=\S)  +/g, ' ')
  result = result.replace(/\n{3,}/g, '\n\n')
  result = result.trim()

  return result
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get('enabled', (data) => {
    if (data.enabled === undefined) {
      chrome.storage.local.set({ enabled: true })
    }
  })
})

chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-copyclean') {
    chrome.storage.local.get('enabled', (data) => {
      const newState = data.enabled !== false ? false : true
      chrome.storage.local.set({ enabled: newState })
    })
  }
})

async function cleanClipboard() {
  const data = await chrome.storage.local.get('enabled')
  if (data.enabled === false) return

  if (isProcessing) return
  isProcessing = true

  try {
    const text = await navigator.clipboard.readText()

    if (!text || text === lastClipboard) {
      isProcessing = false
      return
    }

    lastClipboard = text

    const cleaned = cleanText(text)

    if (cleaned !== text) {
      await navigator.clipboard.writeText(cleaned)
      lastClipboard = cleaned
    }
  } catch (err) {
    // Clipboard access may fail when focus is in certain contexts
  }

  isProcessing = false
}

setInterval(cleanClipboard, 1000)
