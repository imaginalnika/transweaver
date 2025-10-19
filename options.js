document.getElementById('save').addEventListener('click', () => {
  const apiKey = document.getElementById('apiKey').value;
  const systemPrompt = document.getElementById('systemPrompt').value;
  chrome.storage.sync.set({ claudeApiKey: apiKey, systemPrompt: systemPrompt }, () => {
    const status = document.getElementById('status');
    status.textContent = 'Saved!';
    setTimeout(() => {
      status.textContent = '';
    }, 2000);
  });
});

chrome.storage.sync.get(['claudeApiKey', 'systemPrompt'], (result) => {
  if (result.claudeApiKey) {
    document.getElementById('apiKey').value = result.claudeApiKey;
  }
  if (result.systemPrompt) {
    document.getElementById('systemPrompt').value = result.systemPrompt;
  }
});
