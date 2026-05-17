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
