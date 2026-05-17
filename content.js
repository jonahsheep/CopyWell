let enabled = true

chrome.storage.local.get('enabled', (data) => {
  enabled = data.enabled !== false
})

chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    enabled = changes.enabled.newValue
  }
})

document.addEventListener('copy', (e) => {
  if (!enabled) return

  const selection = window.getSelection()
  const text = selection ? selection.toString() : ''

  if (!text) return

  const cleaned = cleanText(text)

  if (cleaned !== text) {
    e.preventDefault()
    e.clipboardData.setData('text/plain', cleaned)
  }
})
