![Tilectron: Tiling Window Browser](resources/doc-title.png)
================================
[![Build Status](https://travis-ci.org/rhysd/Tilectron.svg)](https://travis-ci.org/rhysd/Tilectron)

Tilectron is tiling window browser built on [Electron](https://github.com/atom/electron).

Recently our desktop PC gets very wide screen (4K monitar, 5K iMac, ...).  However major browsers provides only tabs feature and we can only one web page at once.  When we want to see multiple pages at once, we must open them in another window.

Goals:
- Flexible and space-effective tiling window management (fallback to mobile page on narrow window)
- Powerful features for keyboard control junkies (Keyboard-controllable free cursor)
- Highly customizable keyboard mappings
- Robust browser built on Electron (based on Chromium)

Currently being **heavily** constructed.  Below is current screenshot.

![current implementation screen shot](https://raw.githubusercontent.com/rhysd/ss/master/Tilectron/current-progress.gif)

## Installation

This app is not ready for release.  Only [npm](https://www.npmjs.com/) package is available.

```bash
$ npm install electron-prebuilt tilectron
$ tilectron
```

## Work in Progress

- Do not reload page on changing layout
- When window width is narrow, use mobile browser (controlled by UserAgent)

## License

[MIT License](LICENSE.txt)
