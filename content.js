(() => {
  let apiKey = null;
  let systemPrompt = '';
  let culturalInstruction = 'Lean into the style and make it more pronounced and characteristic.';
  let targetLanguage = 'Korean';

  // Custom style settings for A, S, D, W keys
  let styleA = 'Weeb/Anime (use anime references and otaku terms)';
  let langA = 'Original';
  let summaryA = false;
  let styleS = 'Trump (superlatives, simple sentences, tremendous)';
  let langS = 'Original';
  let summaryS = false;
  let styleD = '천박한 디시 (vulgar Korean DC Inside style)';
  let langD = 'Korean';
  let summaryD = false;
  let styleW = 'Hood (African American Vernacular English, slang)';
  let langW = 'Original';
  let summaryW = false;

  // Load settings
  chrome.storage.sync.get([
    'claudeApiKey', 'systemPrompt', 'culturalInstruction', 'targetLanguage',
    'styleA', 'langA', 'summaryA', 'styleS', 'langS', 'summaryS',
    'styleD', 'langD', 'summaryD', 'styleW', 'langW', 'summaryW'
  ], (result) => {
    apiKey = result.claudeApiKey;
    systemPrompt = result.systemPrompt || '';
    culturalInstruction = result.culturalInstruction || 'Lean into the style and make it more pronounced and characteristic.';
    targetLanguage = result.targetLanguage || 'Korean';

    styleA = result.styleA || 'Weeb/Anime (use anime references and otaku terms)';
    langA = result.langA || 'Original';
    summaryA = result.summaryA || false;
    styleS = result.styleS || 'Trump (superlatives, simple sentences, tremendous)';
    langS = result.langS || 'Original';
    summaryS = result.summaryS || false;
    styleD = result.styleD || '천박한 디시 (vulgar Korean DC Inside style)';
    langD = result.langD || 'Korean';
    summaryD = result.summaryD || false;
    styleW = result.styleW || 'Hood (African American Vernacular English, slang)';
    langW = result.langW || 'Original';
    summaryW = result.summaryW || false;

    if (apiKey) {
      console.log('Transweaver: API key loaded ✓');
    } else {
      console.log('Transweaver: No API key found. Set it in extension options.');
    }
  });

  document.addEventListener('keydown', (e) => {
    const selection = window.getSelection();
    const hasSelection = selection && selection.toString().trim();

    if (!hasSelection) return;

    const validKeys = ['e', 'i', 'l', 'S', 'b', 't', 'a', 's', 'd', 'w'];
    if (!validKeys.includes(e.key)) return;

    if (!apiKey) {
      e.preventDefault();
      showApiKeyWarning();
      return;
    }

    if (e.key === 'e') {
      e.preventDefault();
      appendLatinism('e.g.');
    }

    if (e.key === 'i') {
      e.preventDefault();
      appendLatinism('i.e.');
    }

    if (e.key === 'l') {
      e.preventDefault();
      makeLink();
    }

    if (e.key === 'S' && e.shiftKey) {
      e.preventDefault();
      summarizeSelection();
    }

    if (e.key === 'b') {
      e.preventDefault();
      boldifySelection();
    }

    if (e.key === 't' && !e.shiftKey) {
      e.preventDefault();
      translateSelection();
    }

    if (e.key === 'a') {
      e.preventDefault();
      styleRewrite(styleA, langA, summaryA);
    }

    if (e.key === 's') {
      e.preventDefault();
      styleRewrite(styleS, langS, summaryS);
    }

    if (e.key === 'd') {
      e.preventDefault();
      styleRewrite(styleD, langD, summaryD);
    }

    if (e.key === 'w') {
      e.preventDefault();
      styleRewrite(styleW, langW, summaryW);
    }
  });

  function showApiKeyWarning() {
    // Check if warning already exists
    if (document.getElementById('transweaver-warning')) return;

    const warning = document.createElement('div');
    warning.id = 'transweaver-warning';
    warning.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff6b6b;
      color: white;
      padding: 16px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 999999;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      max-width: 300px;
    `;
    warning.innerHTML = '<strong>Transweaver:</strong> No API key found.<br>Right-click extension icon → Options';

    document.body.appendChild(warning);

    setTimeout(() => {
      warning.remove();
    }, 4000);
  }

  function getTextRange() {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      return selection.getRangeAt(0);
    }
    return null;
  }

  function getLocalizedLatinism(latinismType, language) {
    const translations = {
      'e.g.': {
        'Korean': '예:',
        'Japanese': '例:',
        'Chinese': '例如',
        'Spanish': 'p.ej.',
        'French': 'p.ex.',
        'German': 'z.B.',
        'Italian': 'es.',
        'Portuguese': 'p.ex.',
        'Russian': 'напр.',
        'Arabic': 'مثلاً',
        'English': 'e.g.'
      },
      'i.e.': {
        'Korean': '즉',
        'Japanese': 'つまり',
        'Chinese': '即',
        'Spanish': 'es decir',
        'French': 'c.-à-d.',
        'German': 'd.h.',
        'Italian': 'cioè',
        'Portuguese': 'ou seja',
        'Russian': 'т.е.',
        'Arabic': 'أي',
        'English': 'i.e.'
      }
    };

    return translations[latinismType]?.[language] || latinismType;
  }

  function appendLatinism(latinismType) {
    const textRange = getTextRange();
    if (!textRange) return;

    const text = textRange.toString();
    const textNode = textRange.startContainer;
    const element = textNode.parentElement;
    const context = element.textContent;

    // Clear selection
    window.getSelection().removeAllRanges();

    textRange.collapse(false);

    const localizedLatinism = getLocalizedLatinism(latinismType, targetLanguage);
    const latinismNode = document.createElement('span');
    latinismNode.textContent = localizedLatinism;
    latinismNode.style.cursor = 'pointer';

    const elaborationNode = document.createElement('span');
    textRange.insertNode(document.createTextNode(')'));
    textRange.insertNode(elaborationNode);
    textRange.insertNode(document.createTextNode(' '));
    textRange.insertNode(latinismNode);
    textRange.insertNode(document.createTextNode(' ('));

    // Animate dots: 0, 1, 2, 3
    let dotCount = 0;
    const dotInterval = setInterval(() => {
      elaborationNode.textContent = '.'.repeat(dotCount);
      dotCount = (dotCount + 1) % 4;
    }, 300);

    // Create prompt with shared context and latinism-specific example
    let sharedPrompt = '';
    if (systemPrompt) {
      sharedPrompt = `${systemPrompt}\n\n`;
    }
    sharedPrompt += `You are part of a text completion pipeline. The user wants to know more about "${text}" in this context: "${context}"\n\nBe helpful. Complete with just the completion (no prefix):\n`;

    let examplePrompt;
    if (latinismType === 'e.g.') {
      examplePrompt = `dog (${localizedLatinism} golden retriever, poodle)\n${text} (${localizedLatinism}`;
    } else if (latinismType === 'i.e.') {
      examplePrompt = `canine (${localizedLatinism} a dog)\n${text} (${localizedLatinism}`;
    }

    const prompt = sharedPrompt + examplePrompt;

    // Call Claude API
    callClaude(prompt, (text) => {
      clearInterval(dotInterval);
      if (text) {
        // Remove trailing ) if present
        if (text.endsWith(')')) {
          text = text.slice(0, -1);
        }
        elaborationNode.textContent = text;

        // Make latinism clickable to toggle elaboration
        let elaborationCollapsed = false;
        const fullText = text;

        latinismNode.addEventListener('click', () => {
          elaborationCollapsed = !elaborationCollapsed;
          elaborationNode.textContent = elaborationCollapsed ? '...' : fullText;
        });
      } else {
        elaborationNode.textContent = '[API error]';
      }
    });
  }

  function makeLink() {
    const textRange = getTextRange();
    if (!textRange) return;

    const text = textRange.toString();
    const textNode = textRange.startContainer;
    const element = textNode.parentElement;
    const context = element.textContent;

    // Clear selection
    window.getSelection().removeAllRanges();

    // Create anchor element
    const anchor = document.createElement('a');
    anchor.textContent = text;
    anchor.href = '#';
    anchor.style.textDecoration = 'underline';
    anchor.style.color = 'inherit';
    anchor.style.pointerEvents = 'none';
    anchor.style.cursor = 'default';
    anchor.target = '_blank';

    // Replace the range with the anchor
    textRange.deleteContents();
    textRange.insertNode(anchor);

    // Create prompt to get relevant link
    let prompt = '';
    if (systemPrompt) {
      prompt = `${systemPrompt}\n\n`;
    }
    prompt += `You are part of a link generation pipeline. The user wants a relevant link for "${text}" in this context: "${context}"\n\nReturn ONLY a single URL, nothing else. No explanation, just the URL.`;

    // Call Claude API
    callClaude(prompt, (url) => {
      if (url) {
        // Clean up URL (remove trailing ) if present)
        if (url.endsWith(')')) {
          url = url.slice(0, -1);
        }
        anchor.href = url.trim();
        anchor.style.color = 'blue';
        anchor.style.pointerEvents = 'auto';
        anchor.style.cursor = 'pointer';
      } else {
        anchor.href = '#error';
        anchor.style.color = 'red';
      }
    });
  }

  function summarizeSelection() {
    const selection = window.getSelection();
    if (!selection || !selection.toString().trim()) return;

    const range = selection.getRangeAt(0);
    const text = range.toString();

    // Get parent reference before modifying range
    const startContainer = range.startContainer;
    const parentElement = startContainer.nodeType === Node.TEXT_NODE
      ? startContainer.parentElement
      : startContainer;

    // Gray out the original text
    const graySpan = document.createElement('span');
    graySpan.style.color = '#999';
    graySpan.appendChild(range.extractContents());
    range.insertNode(graySpan);

    // Clear selection
    selection.removeAllRanges();

    // Create summary container
    const summaryContainer = document.createElement('div');
    summaryContainer.style.marginBottom = '8px';

    const tldr = document.createElement('strong');
    tldr.textContent = 'tl;dr ';
    summaryContainer.appendChild(tldr);

    const summaryText = document.createElement('span');
    summaryContainer.appendChild(summaryText);

    // Insert above the grayed text
    graySpan.parentNode.insertBefore(summaryContainer, graySpan);

    // Animate dots
    let dotCount = 0;
    const dotInterval = setInterval(() => {
      summaryText.textContent = '.'.repeat(dotCount);
      dotCount = (dotCount + 1) % 4;
    }, 300);

    // Create prompt
    let prompt = '';
    if (systemPrompt) {
      prompt = `${systemPrompt}\n\n`;
    }
    prompt += `Summarize the following text in 2-3 sentences:\n\n"${text}"\n\nReturn your response as HTML with <strong> tags for key terms and <em> tags for emphasis to aid readability. Provide only the HTML content, no explanation.`;

    // Call Claude API
    callClaude(prompt, (summary) => {
      clearInterval(dotInterval);
      if (summary) {
        summaryText.innerHTML = summary;
      } else {
        summaryText.textContent = '[API error]';
      }
    });
  }

  function translateSelection() {
    const selection = window.getSelection();
    if (!selection || !selection.toString().trim()) return;

    const range = selection.getRangeAt(0);
    const text = range.toString();

    // Get parent reference before modifying range
    const startContainer = range.startContainer;
    const parentElement = startContainer.nodeType === Node.TEXT_NODE
      ? startContainer.parentElement
      : startContainer;

    // Gray out the original text
    const graySpan = document.createElement('span');
    graySpan.style.color = '#999';
    graySpan.appendChild(range.extractContents());
    range.insertNode(graySpan);

    // Clear selection
    selection.removeAllRanges();

    // Create translation container
    const translationContainer = document.createElement('div');
    translationContainer.style.marginBottom = '8px';

    const translationText = document.createElement('span');
    translationContainer.appendChild(translationText);

    // Insert above the grayed text
    graySpan.parentNode.insertBefore(translationContainer, graySpan);

    // Animate dots
    let dotCount = 0;
    const dotInterval = setInterval(() => {
      translationText.textContent = '.'.repeat(dotCount);
      dotCount = (dotCount + 1) % 4;
    }, 300);

    // Create prompt
    let prompt = '';
    if (systemPrompt) {
      prompt = `${systemPrompt}\n\n`;
    }
    prompt += `Translate the following text to ${targetLanguage}:\n\n"${text}"\n\nProvide only the translation, no explanation.`;

    // Call Claude API
    callClaude(prompt, (translation) => {
      clearInterval(dotInterval);
      if (translation) {
        translationText.textContent = translation;
      } else {
        translationText.textContent = '[API error]';
      }
    });
  }

  function boldifySelection() {
    const selection = window.getSelection();
    if (!selection || !selection.toString().trim()) return;

    const range = selection.getRangeAt(0);
    const text = range.toString();

    // Create a temporary div to get HTML content
    const tempDiv = document.createElement('div');
    tempDiv.appendChild(range.cloneContents());
    const html = tempDiv.innerHTML || text;

    // Create placeholder span
    const placeholder = document.createElement('span');
    placeholder.innerHTML = html;
    range.deleteContents();
    range.insertNode(placeholder);

    // Clear selection
    selection.removeAllRanges();

    // Animate shimmer: smooth gradient between light and dark
    const colors = ['#333', '#333', '#333', '#444', '#555', '#666', '#777', '#888', '#999', '#aaa', '#bbb', '#ccc', '#ddd', '#ccc', '#bbb', '#aaa', '#999', '#888', '#777', '#666', '#555', '#444'];
    let colorIndex = 0;
    const shimmerInterval = setInterval(() => {
      placeholder.style.color = colors[colorIndex];
      colorIndex = (colorIndex + 1) % colors.length;
    }, 80);

    // Create prompt
    let prompt = '';
    if (systemPrompt) {
      prompt = `${systemPrompt}\n\n`;
    }
    prompt += `Add <strong> tags for key terms and <em> tags for emphasis to the following text to improve readability:\n\n${html}\n\nReturn only the HTML with formatting added, no explanation.`;

    // Call Claude API
    callClaude(prompt, (formattedHtml) => {
      clearInterval(shimmerInterval);
      placeholder.style.color = '';
      if (formattedHtml) {
        placeholder.innerHTML = formattedHtml;
      } else {
        placeholder.textContent = text;
      }
    });
  }

  function styleRewrite(style, language, asSummary) {
    const selection = window.getSelection();
    if (!selection || !selection.toString().trim()) return;

    const range = selection.getRangeAt(0);
    const text = range.toString();

    // Create a temporary div to get HTML content
    const tempDiv = document.createElement('div');
    tempDiv.appendChild(range.cloneContents());
    const html = tempDiv.innerHTML || text;

    if (asSummary) {
      // Summary mode: add above and gray out original
      const startContainer = range.startContainer;
      const parentElement = startContainer.nodeType === Node.TEXT_NODE
        ? startContainer.parentElement
        : startContainer;

      // Gray out the original text
      const graySpan = document.createElement('span');
      graySpan.style.color = '#999';
      graySpan.appendChild(range.extractContents());
      range.insertNode(graySpan);

      // Clear selection
      selection.removeAllRanges();

      // Create summary container
      const summaryContainer = document.createElement('div');
      summaryContainer.style.marginBottom = '8px';

      const summaryText = document.createElement('span');
      summaryContainer.appendChild(summaryText);

      // Insert above the grayed text
      graySpan.parentNode.insertBefore(summaryContainer, graySpan);

      // Animate dots
      let dotCount = 0;
      const dotInterval = setInterval(() => {
        summaryText.textContent = '.'.repeat(dotCount);
        dotCount = (dotCount + 1) % 4;
      }, 300);

      // Create prompt
      let prompt = '';
      if (systemPrompt) {
        prompt = `${systemPrompt}\n\n`;
      }

      const languageInstruction = language === 'Original'
        ? 'Keep the output in the same language as the input.'
        : `Translate the output to ${language}.`;

      const culturalInstructionText = language === 'Original'
        ? ''
        : ` ${culturalInstruction}`;

      prompt += `Rewrite the following text in this style: ${style}\n\n${languageInstruction}${culturalInstructionText}\n\nInput text:\n${text}\n\nProvide only the rewritten text, no explanation.`;

      // Call Claude API
      callClaude(prompt, (styledText) => {
        clearInterval(dotInterval);
        if (styledText) {
          summaryText.textContent = styledText;
        } else {
          summaryText.textContent = '[API error]';
        }
      });
    } else {
      // In-place mode: replace with shimmer
      const placeholder = document.createElement('span');
      placeholder.innerHTML = html;
      range.deleteContents();
      range.insertNode(placeholder);

      // Clear selection
      selection.removeAllRanges();

      // Animate shimmer: smooth gradient between light and dark
      const colors = ['#333', '#333', '#333', '#444', '#555', '#666', '#777', '#888', '#999', '#aaa', '#bbb', '#ccc', '#ddd', '#ccc', '#bbb', '#aaa', '#999', '#888', '#777', '#666', '#555', '#444'];
      let colorIndex = 0;
      const shimmerInterval = setInterval(() => {
        placeholder.style.color = colors[colorIndex];
        colorIndex = (colorIndex + 1) % colors.length;
      }, 80);

      // Create prompt
      let prompt = '';
      if (systemPrompt) {
        prompt = `${systemPrompt}\n\n`;
      }

      const languageInstruction = language === 'Original'
        ? 'Keep the output in the same language as the input.'
        : `Translate the output to ${language}.`;

      const culturalInstructionText = language === 'Original'
        ? ''
        : ` ${culturalInstruction}`;

      prompt += `Rewrite the following text in this style: ${style}\n\n${languageInstruction}${culturalInstructionText}\n\nInput text:\n${html}\n\nReturn as HTML with <strong> and <em> tags where appropriate. Provide only the HTML, no explanation.`;

      // Call Claude API
      callClaude(prompt, (styledHtml) => {
        clearInterval(shimmerInterval);
        placeholder.style.color = '';
        if (styledHtml) {
          placeholder.innerHTML = styledHtml;
        } else {
          placeholder.textContent = text;
        }
      });
    }
  }

  function callClaude(prompt, callback) {
    chrome.runtime.sendMessage(
      {
        type: 'CALL_CLAUDE',
        prompt: prompt,
        apiKey: apiKey
      },
      (response) => {
        if (response.success) {
          const text = response.data.content[0].text;
          callback(text);
        } else {
          console.error('Error calling Claude API:', response.error);
          callback(null);
        }
      }
    );
  }
})();
