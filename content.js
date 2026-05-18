let enabled = true

chrome.storage.local.get('enabled', (data) => {
  enabled = data.enabled !== false
})

chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    enabled = changes.enabled.newValue
  }
})

function getSelectedText() {
  const active = document.activeElement
  if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
    return active.value.substring(active.selectionStart, active.selectionEnd)
  }
  const sel = window.getSelection()
  return sel ? sel.toString() : ''
}

document.addEventListener('copy', (e) => {
  if (!enabled) return

  const text = getSelectedText()
  if (!text) return

  const cleaned = cleanText(text)
  if (cleaned === text) return

  e.preventDefault()
  e.clipboardData.setData('text/plain', cleaned)
})

document.addEventListener('paste', (e) => {
  if (!enabled) return

  const text = e.clipboardData.getData('text/plain')
  if (!text) return

  const cleaned = cleanText(text)
  if (cleaned === text) return

  e.preventDefault()

  const active = document.activeElement
  if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
    const start = active.selectionStart
    const end = active.selectionEnd
    const before = active.value.substring(0, start)
    const after = active.value.substring(end)
    active.value = before + cleaned + after
    active.selectionStart = active.selectionEnd = start + cleaned.length
    return
  }

  const selection = window.getSelection()
  if (selection.rangeCount) {
    const range = selection.getRangeAt(0)
    range.deleteContents()
    const node = document.createTextNode(cleaned)
    range.insertNode(node)
    range.setStartAfter(node)
    range.setEndAfter(node)
    selection.removeAllRanges()
    selection.addRange(range)
  }
})
