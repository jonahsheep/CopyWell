const toggle = document.getElementById('toggle')
const label = document.getElementById('toggleLabel')
const cleanBtn = document.getElementById('cleanBtn')

chrome.storage.local.get('enabled', (data) => {
  const enabled = data.enabled !== false
  toggle.checked = enabled
  label.textContent = enabled ? 'Enabled' : 'Disabled'
})

toggle.addEventListener('change', () => {
  const enabled = toggle.checked
  label.textContent = enabled ? 'Enabled' : 'Disabled'
  chrome.storage.local.set({ enabled })
})

cleanBtn.addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText()
    const cleaned = cleanText(text)
    await navigator.clipboard.writeText(cleaned)
    cleanBtn.textContent = 'Cleaned!'
    cleanBtn.classList.add('success')
    setTimeout(() => {
      cleanBtn.textContent = 'Clean Clipboard'
      cleanBtn.classList.remove('success')
    }, 1500)
  } catch (err) {
    cleanBtn.textContent = 'Failed — try again'
    cleanBtn.classList.add('error')
    setTimeout(() => {
      cleanBtn.textContent = 'Clean Clipboard'
      cleanBtn.classList.remove('error')
    }, 2000)
  }
})
