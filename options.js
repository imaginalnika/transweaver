document.getElementById('save').addEventListener('click', () => {
  const settings = {
    claudeApiKey: document.getElementById('apiKey').value,
    systemPrompt: document.getElementById('systemPrompt').value,
    targetLanguage: document.getElementById('targetLanguage').value,
    styleA: document.getElementById('styleA').value,
    langA: document.getElementById('langA').value,
    styleS: document.getElementById('styleS').value,
    langS: document.getElementById('langS').value,
    styleD: document.getElementById('styleD').value,
    langD: document.getElementById('langD').value,
    styleW: document.getElementById('styleW').value,
    langW: document.getElementById('langW').value
  };

  chrome.storage.sync.set(settings, () => {
    const status = document.getElementById('status');
    status.textContent = 'Saved!';
    setTimeout(() => {
      status.textContent = '';
    }, 2000);
  });
});

chrome.storage.sync.get([
  'claudeApiKey', 'systemPrompt', 'targetLanguage',
  'styleA', 'langA', 'styleS', 'langS', 'styleD', 'langD', 'styleW', 'langW'
], (result) => {
  if (result.claudeApiKey) document.getElementById('apiKey').value = result.claudeApiKey;
  if (result.systemPrompt) document.getElementById('systemPrompt').value = result.systemPrompt;
  if (result.targetLanguage) document.getElementById('targetLanguage').value = result.targetLanguage;
  if (result.styleA) document.getElementById('styleA').value = result.styleA;
  if (result.langA) document.getElementById('langA').value = result.langA;
  if (result.styleS) document.getElementById('styleS').value = result.styleS;
  if (result.langS) document.getElementById('langS').value = result.langS;
  if (result.styleD) document.getElementById('styleD').value = result.styleD;
  if (result.langD) document.getElementById('langD').value = result.langD;
  if (result.styleW) document.getElementById('styleW').value = result.styleW;
  if (result.langW) document.getElementById('langW').value = result.langW;
});
