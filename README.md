# Transweaver

Text manipulation via LLMs **on the webpage**. Select some text in the page -> press a key for magic.

## Requirements

- Chromium-based Browser (e.g. Google Chrome, Microsoft Edge, etc.)
- Claude API Key

## Keys

- **e** - e.g. (examples)
- **i** - i.e. (explanations)
- **l** - hyperlink
- **Shift+S** - tl;dr
- **b** - add bold/italic emphasis
- **t** - translate
- **a** - custom style #1 (configurable)
- **s** - custom style #2 (configurable)
- **d** - custom style #3 (configurable)
- **w** - custom style #4 (configurable)

## Setup

1. Go to `chrome://extensions`
2. Turn on `Developer mode` top right, then `Load unpacked` top left (select this repository's folder)
3. Go to Options of Transweaver (click on icon)
4. Add Claude API Key
5. (Optional) Configure custom styles for a/s/d/w keys - choose from 20+ styles like Weeb, Trump, 디시말투, Hood, Gen Z, etc.
6. (Optional) Set target language for each custom style key
7. (Optional) Add system prompt

## Troubleshooting

If you are using Vimium, some keys will clash. Add the following to Vimium's options:

```
unmap i
unmap l
unmap b
unmap t
unmap a
unmap s
unmap d
unmap w
```
