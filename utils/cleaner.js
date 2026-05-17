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
    result = result.replace(/(?<=\S)\n(?=[a-z])/g, ' ')
  }

  result = result.replace(/^ +/gm, '')

  result = result.trim()

  return result
}
