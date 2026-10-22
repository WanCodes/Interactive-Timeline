# Interactive Timeline

**Wan Yau** · Senior Full Stack Developer, London · [WanCodes](https://github.com/WanCodes)

A responsive interactive timeline of IG Group’s company history. The page loads every year from JSON, then lets a visitor drag through the story, jump to a year, play filmed interviews, and open historical site screenshots. The repository description points at IG Group’s public history page: [iggroup.com/about-ig-group/our-history](http://www.iggroup.com/about-ig-group/our-history).

<img width="1728" height="909" alt="Interactive timeline showing IG Group history, with the year rail, drag strip, and topic rows" src="https://github.com/user-attachments/assets/592f78d3-55e6-4a6e-bb67-ccd03511a911" />

## Overview

This is a single static page. `main.js` defines a `Timeline` class that fetches `data.json` with `XMLHttpRequest` and builds one frame per event. The bundled story runs from **1974 to 2017** (44 years): founding, headcount, products, offices, and leadership, told in four rows — Economic, Technology, People, and Geography.

There is no install step and no build. The HTML, CSS, JSON, images, and `dragdealer.js` are the application.

## Features

- **Drag to scroll.** The strip is a [Dragdealer](https://github.com/skidding/dragdealer) 0.9.8 slider (`steps`, `loose: true`, `speed: 0.1`). `bg.jpg` shifts with the drag for a light parallax effect.
- **Year rail.** The left column lists every year. Click a year, or the year label on a frame, to jump there. The active year scales up and turns `#DA291C`. Moving the pointer over the rail scrolls the list; otherwise the rail follows the timeline.
- **Step arrows.** Left and right arrows move one frame. The left arrow is hidden on the first frame and the right arrow is hidden on the last.
- **Mixed media on each year.** An event can carry zero, one, or two assets. Supported types are `text`, `quote`, `image`, and `video`. Two assets are stacked; a single asset is staggered vertically so neighbouring years do not line up in a flat row. An empty `type` is skipped.
- **Brightcove video.** A video asset shows a thumbnail and caption. Hover reveals the play icon. A click that is not part of a drag opens the overlay, loads that `video_id` through the Brightcove catalog API, and plays it. Closing the overlay pauses playback.
- **Topic rows and lightbox.** Every year has four article texts, in Economic / Technology / People / Geography order. The row labels are the `topics.png` graphic; the `title` field is stored in JSON and is not written into the page. Six years add a lightbox link that opens a full-page screenshot from `history/` (1998, 2005, 2006, 2011, 2013, 2014).
- **Width-aware layout.** Frames stay 250px wide. On resize, the number of drag steps shrinks as more of the strip fits in the viewport, and Dragdealer is asked to reflow. Lightbox images use a 1200px background size, or the viewport width when that is smaller.

## Tech stack

| Layer | What the page uses |
| --- | --- |
| Markup | HTML5 (`index.html`), with `X-UA-Compatible` set to `IE=10,Edge` |
| Style | Custom CSS (`main.css`). Avenir Next (weights 300–700) is loaded from fonts.net and `a.c-dn.net`, with Arial / Helvetica as the fallback |
| Behaviour | jQuery 3.2.1 (Google CDN) and a custom `Timeline` prototype in `main.js` |
| Motion | GSAP TweenMax 1.18.0 (cdnjs) for the year highlight, nav scroll, and video overlay |
| Drag | Dragdealer.js 0.9.8, bundled. The file header is MIT |
| Video | Brightcove player script and Video.js, account `2830693144001`, player `8d914a8e-0772-4b65-b040-afb00fc98328` |
| Content | `data.json`, fetched at runtime |

jQuery, TweenMax, the Brightcove player, and the webfonts are loaded from those CDNs, so the page needs a network connection for the full experience.

## Project structure

```
Interactive-Timeline/
├── index.html        # Page shell, Brightcove player, script tags
├── main.css          # Layout, type, nav, video overlay, lightbox
├── main.js           # Load JSON, build frames, drag, nav, video, lightbox
├── data.json         # 44 events, 1974–2017
├── dragdealer.js     # Dragdealer 0.9.8
├── bg.jpg            # Repeating strip background
├── topics.png        # Economic / Technology / People / Geography labels
├── play_icon.png     # Video hover icon
├── quote_icon.png    # Quote mark
├── red_arrow.png     # Marker under the year rail
├── close_btn.png     # Overlay close control
├── images/           # Thumbnails and stills referenced by data.json
└── history/          # Lightbox screenshots (six are linked; 2003, 2007, 2016, and 2017 are in the folder and unused)
```

## Content model

`data.json` is one object with an `events` array. Each event looks like this (1974, shortened):

```json
{
  "year": "1974",
  "employees": "3 employees",
  "asset": [
    {
      "type": "video",
      "url": "images/1974.jpg",
      "video_id": "5449365950001",
      "message": "Stuart Wheeler talks about why he set up IG"
    }
  ],
  "articles": [
    { "title": "ECONOMIC", "text": "..." },
    { "title": "TECHNOLOGY", "text": "" },
    { "title": "PEOPLE", "text": "3 employees<br><br>Stuart Wheeler starts IG Investors Gold" },
    { "title": "GEOGRAPHY", "text": "..." }
  ]
}
```

- **`asset`** — `text` uses `message` (HTML is allowed). `quote` uses `message`. `image` uses `url`. `video` uses `url` (thumbnail), `video_id`, and `message` (caption). A blank `type` renders nothing.
- **`articles`** — four entries, in the order above. `text` may contain HTML such as `<br>` and `&pound;`. An optional `lightbox` object (`url`, `text`) appends a link under that row.
- **`employees`** — present on every event. `main.js` does not read it. Headcount that appears on screen is the copy inside the People article.

To point video at another Brightcove account, change `data-account`, `data-player`, and the player script URL in `index.html`, and supply matching `video_id` values in `data.json`.

## Run locally

Serve the folder over HTTP. The timeline requests `data.json` with `XMLHttpRequest`, which browsers block from a `file://` URL.

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000). Any other static server pointed at this directory works the same way. Nothing is compiled.

## Notes

The markup asks for IE 10 and Edge document mode. What actually runs depends on jQuery 3.2.1, GSAP 1.18, Dragdealer 0.9.8, and the Brightcove player.

This repository does not include a license file. `dragdealer.js` keeps its own MIT notice in the file header.
