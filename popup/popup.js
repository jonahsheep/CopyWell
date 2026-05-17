const toggle = document.getElementById('toggle')
const label = document.getElementById('toggleLabel')

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
