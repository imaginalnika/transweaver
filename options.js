const styles = [
  { value: 'Weeb/Anime (use anime references and otaku terms)', label: 'Weeb/Anime' },
  { value: '씹덕 (hardcore Korean otaku, extreme anime obsession)', label: '씹덕' },
  { value: 'Trump (superlatives, simple sentences, tremendous)', label: 'Trump' },
  { value: '천박한 디시 (vulgar Korean DC Inside style)', label: '천박한 디시' },
  { value: '사투리 (Korean dialect, casual and regional)', label: '사투리' },
  { value: '급식 (Korean elementary/middle school kid style)', label: '급식' },
  { value: '틀딱 (Korean old person/boomer style)', label: '틀딱' },
  { value: '팩트충 (fact-obsessed pedantic Korean style)', label: '팩트충' },
  { value: '홍대병 말기 (extreme Hongdae hipster style)', label: '홍대병 말기' },
  { value: '롤악귀 (League of Legends addict)', label: '롤악귀' },
  { value: '발악귀 (Valorant addict)', label: '발악귀' },
  { value: '마크악귀 (Minecraft addict)', label: '마크악귀' },
  { value: '언더테일 팬 (Undertale fan, quirky references)', label: '언더테일 팬' },
  { value: 'T1 팬 (T1 esports fan, Faker worship)', label: 'T1 팬' },
  { value: '티모 (Teemo player, annoying and toxic)', label: '티모' },
  { value: '피파충 (FIFA addict, soccer obsessed)', label: '피파충' },
  { value: 'Hood (African American Vernacular English, slang)', label: 'Hood/AAVE' },
  { value: 'Gen Z (internet slang, no cap, fr fr, bussin)', label: 'Gen Z' },
  { value: 'Shakespeare (thee, thou, wherefore art)', label: 'Shakespeare' },
  { value: 'Pirate (arr, matey, ye, treasure)', label: 'Pirate' },
  { value: 'UwU speak (cutesy, kawaii, nuzzles)', label: 'UwU' },
  { value: 'Boomer (back in my day, kids these days)', label: 'Boomer' },
  { value: 'Caveman (me want, you go, simple words)', label: 'Caveman' }
];

['A', 'S', 'D', 'W'].forEach(key => {
  const select = document.getElementById('style' + key);
  styles.forEach(style => {
    const option = document.createElement('option');
    option.value = style.value;
    option.textContent = style.label;
    select.appendChild(option);
  });
});

document.getElementById('save').addEventListener('click', () => {
  const settings = {
    claudeApiKey: document.getElementById('apiKey').value,
    systemPrompt: document.getElementById('systemPrompt').value,
    culturalInstruction: document.getElementById('culturalInstruction').value,
    targetLanguage: document.getElementById('targetLanguage').value,
    styleA: document.getElementById('styleA').value,
    langA: document.getElementById('langA').value,
    summaryA: document.getElementById('summaryA').checked,
    styleS: document.getElementById('styleS').value,
    langS: document.getElementById('langS').value,
    summaryS: document.getElementById('summaryS').checked,
    styleD: document.getElementById('styleD').value,
    langD: document.getElementById('langD').value,
    summaryD: document.getElementById('summaryD').checked,
    styleW: document.getElementById('styleW').value,
    langW: document.getElementById('langW').value,
    summaryW: document.getElementById('summaryW').checked
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
  'claudeApiKey', 'systemPrompt', 'culturalInstruction', 'targetLanguage',
  'styleA', 'langA', 'summaryA', 'styleS', 'langS', 'summaryS',
  'styleD', 'langD', 'summaryD', 'styleW', 'langW', 'summaryW'
], (result) => {
  if (result.claudeApiKey) document.getElementById('apiKey').value = result.claudeApiKey;
  if (result.systemPrompt) document.getElementById('systemPrompt').value = result.systemPrompt;
  if (result.culturalInstruction) document.getElementById('culturalInstruction').value = result.culturalInstruction;
  if (result.targetLanguage) document.getElementById('targetLanguage').value = result.targetLanguage;
  if (result.styleA) document.getElementById('styleA').value = result.styleA;
  if (result.langA) document.getElementById('langA').value = result.langA;
  if (result.summaryA !== undefined) document.getElementById('summaryA').checked = result.summaryA;
  if (result.styleS) document.getElementById('styleS').value = result.styleS;
  if (result.langS) document.getElementById('langS').value = result.langS;
  if (result.summaryS !== undefined) document.getElementById('summaryS').checked = result.summaryS;
  if (result.styleD) document.getElementById('styleD').value = result.styleD;
  if (result.langD) document.getElementById('langD').value = result.langD;
  if (result.summaryD !== undefined) document.getElementById('summaryD').checked = result.summaryD;
  if (result.styleW) document.getElementById('styleW').value = result.styleW;
  if (result.langW) document.getElementById('langW').value = result.langW;
  if (result.summaryW !== undefined) document.getElementById('summaryW').checked = result.summaryW;
});
