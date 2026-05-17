function normalizeQuotes(text) {
  return text
    .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"')
    .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'")
}

function normalizeDashes(text) {
  return text
    .replace(/\u2013|\u2014/g, '-')
    .replace(/\u2015/g, '--')
}

function removeInvisibleChars(text) {
  return text.replace(/[\u200B-\u200D\uFEFF\u00AD\u2060\u2061\u2062\u2063\u2064]/g, '')
}

function normalizeUnicode(text) {
  text = normalizeQuotes(text)
  text = normalizeDashes(text)
  text = removeInvisibleChars(text)
  text = text.normalize('NFC')
  return text
}
