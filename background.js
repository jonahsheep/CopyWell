chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get('enabled', (data) => {
    if (data.enabled === undefined) {
      chrome.storage.local.set({ enabled: true })
    }
  })
})

chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-copyclean') {
    chrome.storage.local.get('enabled', (data) => {
      const newState = data.enabled !== false ? false : true
      chrome.storage.local.set({ enabled: newState })
    })
  }
})
