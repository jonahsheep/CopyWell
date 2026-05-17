function cleanText(text) {
  if (!text) return text

  const structure = detectStructure(text)
  let result = text

  result = normalizeUnicode(result)

  if (structure.hasCitations) {
    result = result.replace(/\[\d+(?:[,\s-]+\d+)*\]/g, '')
    result = result.replace(/\(\d{4}\)/g, '')
    result = result.replace(/\[\d{4}\]/g, '')
  }

  result = result.replace(/\r\n/g, '\n')

  if (!structure.isCode) {
    result = result.replace(/[ \t]+/g, ' ')
    result = result.replace(/\n{3,}/g, '\n\n')
  }

  if (!structure.isCode && !structure.isBulletList && !structure.isPoetry) {
    const lines = result.split('\n')
    const merged = []
    let buffer = ''
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (!line.trim()) {
        if (buffer) { merged.push(buffer); buffer = '' }
        merged.push(line)
        continue
      }
      if (!buffer) {
        buffer = line
        continue
      }
      if (/[.!?:]$/.test(buffer.trim()) || /^[A-Z]/.test(line.trimStart())) {
        merged.push(buffer)
        buffer = line
      } else {
        buffer += ' ' + line.trimStart()
      }
    }
    if (buffer) merged.push(buffer)
    result = merged.join('\n')
  }

  result = result.replace(/^ +/gm, '')

  result = result.trim()

  return result
}
