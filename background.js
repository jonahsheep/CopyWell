chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get('enabled', (data) => {
    if (data.enabled === undefined) {
      chrome.storage.local.set({ enabled: true })
    }
  })
})
