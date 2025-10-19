# Transweaver

Text manipulation via LLMs **on the webpage**. Select some text in the page -> press a key for magic.

## Requirements

- Chromium-based Browser (e.g. Google Chrome, Microsoft Edge, etc.)
- Claude API Key

## Keys

- **e** - e.g. (examples)
- **i** - i.e. (explanations)
- **l** - hyperlink
- **s** - tl;dr
- **b** - add bold/italic emphasis
- **r** - rewrite
- **t** - translate

## Setup

1. Go to `chrome://extensions`
2. Turn on `Developer mode` top right, then `Load unpacked` top left (select this repository's folder)
3. Go to Options of Transweaver (click on icon)
4. Add Claude API Key
5. (Optional) Choose translation target language (default: Korean)
6. (Optional) Add system prompt

## Troubleshooting

If you are using Vimium, some keys will clash. Add the following to Vimium's options:

```
unmap i
unmap l
unmap b
unmap r
unmap t
```
