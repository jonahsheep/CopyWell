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

  if (e.clipboardData) {
    e.clipboardData.setData('text/plain', cleaned)
  } else {
    const textarea = document.createElement('textarea')
    textarea.value = cleaned
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  }
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

    const lines = cleaned.split('\n')
    if (lines.length === 1) {
      range.insertNode(document.createTextNode(cleaned))
    } else {
      const container = document.createElement('div')
      container.style.whiteSpace = 'pre-wrap'
      lines.forEach((line, i) => {
        container.appendChild(document.createTextNode(line))
        if (i < lines.length - 1) {
          container.appendChild(document.createElement('br'))
        }
      })
      range.insertNode(container)
      range.setStartAfter(container)
      range.setEndAfter(container)
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }
})
