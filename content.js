(() => {
  let apiKey = null;
  let systemPrompt = '';

  // Load API key and system prompt
  chrome.storage.sync.get(['claudeApiKey', 'systemPrompt'], (result) => {
    apiKey = result.claudeApiKey;
    systemPrompt = result.systemPrompt || '';
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

    const validKeys = ['e', 'i', 'c', 'l', 's', 'b', 'r'];
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

    if (e.key === 'c') {
      e.preventDefault();
      appendLatinism('c.f.');
    }

    if (e.key === 'l') {
      e.preventDefault();
      makeLink();
    }

    if (e.key === 's') {
      e.preventDefault();
      summarizeSelection();
    }

    if (e.key === 'b') {
      e.preventDefault();
      boldifySelection();
    }

    if (e.key === 'r') {
      e.preventDefault();
      rewriteSelection();
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

    const latinismNode = document.createElement('span');
    latinismNode.textContent = latinismType;
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
      examplePrompt = `dog (e.g. golden retriever, poodle)\n${text} (e.g.`;
    } else if (latinismType === 'i.e.') {
      examplePrompt = `canine (i.e. a dog)\n${text} (i.e.`;
    } else if (latinismType === 'c.f.') {
      examplePrompt = `democracy (c.f. oligarchy, autocracy)\n${text} (c.f.`;
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

  function rewriteSelection() {
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
    prompt += `Rewrite the following text to improve clarity and readability:\n\n${text}\n\nReturn the rewritten text as HTML with <strong> and <em> tags where appropriate. Provide only the HTML, no explanation.`;

    // Call Claude API
    callClaude(prompt, (rewrittenHtml) => {
      clearInterval(shimmerInterval);
      placeholder.style.color = '';
      if (rewrittenHtml) {
        placeholder.innerHTML = rewrittenHtml;
      } else {
        placeholder.textContent = text;
      }
    });
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
